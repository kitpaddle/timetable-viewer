<script setup>
/* Icons for trains and bus */
import busSvg from 'lucide-static/icons/bus.svg?raw'
import trainSvg from 'lucide-static/icons/train-front.svg?raw'

/* ── static imports (one-time, in bundle) ─────────────────── */
import * as L from 'leaflet' // static import at the top
import 'leaflet.markercluster/dist/leaflet.markercluster.js'   // plugin IIFE runs immediately

import { onMounted, onBeforeUnmount, onActivated, ref, computed, nextTick } from 'vue'
import { useLang } from '../composables/useLang'
import { useStations } from '../composables/useStations'

// Import global Cache
import { stationCache } from '../services/stationCache.js'

// Import icons
import { iconConfig } from '../services/iconConfig.js'


// Expand single-char mode codes from JSON back to full names used by iconConfig/StationCard
const MODE_EXPAND = { b: 'bus', r: 'rail', t: 'tram', m: 'metro', w: 'water', f: 'ferry', o: 'other' }

const { addStation } = useStations()

let map
let cluster = null
let markerMap = {}
let locationDot = null
let locationRing = null
let cancelled = false
const locateState = ref('idle') // 'idle' | 'locating' | 'error'
const stopsLoading = ref(true)
const searchQuery = ref('')
const searchOpen = ref(false)
const { t } = useLang()

const searchResults = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q || !stationCache.stopCache) return []
    const results = []
    for (const s of stationCache.stopCache) {
        if (s[1].toLowerCase().includes(q)) {
            results.push(s)
            if (results.length >= 8) break
        }
    }
    return results
})
const MAP_STATE_KEY = 'leafletMapState' //Save location and zoom locally
const saved = JSON.parse(localStorage.getItem(MAP_STATE_KEY) || '{}')
const initialCenter = saved.center || [63.0, 16.5]
const initialZoom = saved.zoom || 5


onMounted(async () => {
    // Setup map and onBeforeUnmount synchronously
    map = L.map('map').setView(initialCenter, initialZoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    nextTick(() => map.invalidateSize())

    map.on('locationfound', e => {
        locateState.value = 'idle'
        if (locationDot) map.removeLayer(locationDot)
        if (locationRing) map.removeLayer(locationRing)
        locationDot = L.circleMarker(e.latlng, {
            radius: 7, fillColor: '#3b82f6', color: '#fff', weight: 2, fillOpacity: 1
        }).addTo(map)
        if (e.accuracy > 0) {
            locationRing = L.circle(e.latlng, {
                radius: e.accuracy, color: '#3b82f6', fillColor: '#93c5fd',
                fillOpacity: 0.15, weight: 1, interactive: false
            }).addTo(map)
        }
    })
    map.on('locationerror', () => { locateState.value = 'error'; setTimeout(() => locateState.value = 'idle', 3000) })

    onBeforeUnmount(() => {
        cancelled = true
        const center = map.getCenter()
        const zoom = map.getZoom()
        localStorage.setItem(MAP_STATE_KEY, JSON.stringify({
            center: [center.lat, center.lng],
            zoom
        }))
    })

    // Delegate “Add” button clicks
    map.on('popupopen', e => {
        const btn = e.popup.getElement().querySelector('button')
        if (!btn) return

        // Get the stop from the marker itself
        const stop = e.popup._source._stop
        btn._stop = stop

        btn.onclick = () => {
            if (!btn._stop) return
            const [id, name, lat, lon, modeChar] = btn._stop
            addStation({ id, name, lat, lon, transportMode: MODE_EXPAND[modeChar] || 'other' })

            btn.textContent = t('stationAdded')
            btn.disabled = true
            btn.classList.add('added')
            setTimeout(() => {
                btn.textContent = t('addStationBtn')
                btn.disabled = false
                btn.classList.remove('added')
            }, 2500)
        }
    })

    // Fetch stops immediately in parallel with tile loading
    if (!stationCache.stopCache) {
        stationCache.stopCache = await fetch(`${import.meta.env.BASE_URL}stops.min2.json`)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
                return r.json()
            })
    }

    // Wait for tiles to paint, then build markers in chunks
    // Cluster is added to the map only once fully built — stops appear all at once
    let buildStarted = false
    const startBuild = () => {
        if (cancelled || buildStarted) return
        buildStarted = true
        cluster = L.markerClusterGroup()
        markerMap = {}
        const stops = stationCache.stopCache
        const CHUNK = 2000
        let i = 0

        function addChunk() {
            if (cancelled) return
            const end = Math.min(i + CHUNK, stops.length)
            for (; i < end; i++) {
                const s = stops[i]
                const { svg, color, bg } = iconConfig[MODE_EXPAND[s[4]]] || iconConfig.other
                const m = L.marker([s[2], s[3]], { icon: makeIcon(svg, color, bg) })
                m.bindPopup(renderPopup(s))
                m._stop = s
                markerMap[s[0]] = m
                cluster.addLayer(m)
            }
            if (i < stops.length) {
                setTimeout(addChunk, 0)
            } else if (!cancelled) {
                map.addLayer(cluster)
                stopsLoading.value = false
            }
        }
        setTimeout(addChunk, 0)
    }

    map.once('load', startBuild)
    // Fallback: if tiles are already cached and load fires before we attach, start after a short delay
    setTimeout(() => { if (stopsLoading.value) startBuild() }, 1000)

})

onActivated(() => { if (map) map.invalidateSize() })

function searchStop(s) {
    searchQuery.value = ''
    searchOpen.value = false
    const marker = markerMap[s[0]]
    if (marker && cluster) {
        cluster.zoomToShowLayer(marker, () => marker.openPopup())
    } else {
        map.flyTo([s[2], s[3]], 16)
    }
}

function locateMe() {
    locateState.value = 'locating'
    map.locate({ setView: true, maxZoom: 14 })
}

function makeIcon(svg, color = '#2563eb', bg = '#fff') {
    return L.divIcon({
        html: `<div class="map-icon" style="color:${color}; background:${bg}">${svg}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    })
}

function renderPopup(s) {
    return `
    <div class="popup-card">
      <div class="popup-title">${s[1]}</div>
      <button class="popup-btn">${t('addStationBtn')}</button>
      <div class="popup-id">Stop ID: ${s[0]}</div>
    </div>`
}

</script>

<template>
    <div class="map-wrapper">
        <div id="map"></div>
        <div v-if="stopsLoading" class="map-loading">Laddar hållplatser…</div>

        <div class="search-box">
            <input
                class="search-input"
                :placeholder="t('searchPlaceholder')"
                v-model="searchQuery"
                @focus="searchOpen = true"
                @blur="setTimeout(() => searchOpen = false, 150)"
            />
            <ul v-if="searchOpen && searchResults.length > 0" class="search-results">
                <li v-for="s in searchResults" :key="s[0]" @mousedown="searchStop(s)">
                    <span class="search-result-name">{{ s[1] }}</span>
                    <span class="search-result-mode">{{ s[5] || MODE_EXPAND[s[4]] }}</span>
                </li>
            </ul>
        </div>

        <button
            class="locate-btn"
            :class="{ locating: locateState === 'locating', error: locateState === 'error' }"
            @click="locateMe"
            :disabled="locateState === 'locating'"
        >
            <span v-if="locateState === 'idle'">📍 {{ t('locateMe') }}</span>
            <span v-else-if="locateState === 'locating'">{{ t('locating') }}</span>
            <span v-else>{{ t('locationErr') }}</span>
        </button>
    </div>
</template>

<style>
@import "https://unpkg.com/leaflet/dist/leaflet.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css";

.map-wrapper {
    position: relative;
    height: 100%;
}

#map {
    height: 100%;
}

.map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: rgba(0,0,0,0.65);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 12px;
    pointer-events: none;
    white-space: nowrap;
}

.search-box {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    width: 220px;
}

.search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 6px 10px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    border: 2px solid rgba(0,0,0,0.2);
    border-radius: 6px;
    background: white;
    color: #333;
    box-shadow: 0 1px 5px rgba(0,0,0,0.3);
    outline: none;
}

.search-input:focus {
    border-color: #3b82f6;
}

.search-results {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
    background: white;
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    overflow: hidden;
}

.search-results li {
    padding: 7px 10px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    color: #333;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
}

.search-results li:last-child {
    border-bottom: none;
}

.search-results li:hover {
    background: #f0f7ff;
}

.search-result-name {
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.search-result-mode {
    flex: 0 0 auto;
    font-size: 11px;
    color: #888;
    text-transform: capitalize;
    margin-left: 6px;
}

.locate-btn {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 6px 14px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    font-weight: 500;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background: white;
    color: #333;
    cursor: pointer;
    box-shadow: 0 1px 5px rgba(0,0,0,0.3);
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
}

.locate-btn:hover:not(:disabled) {
    background: #f0f0f0;
}

.locate-btn.locating {
    color: #888;
    cursor: default;
}

.locate-btn.error {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fca5a5;
}

.map-icon {
    width: 30x;
    height: 30px;
    border-radius: 50%;
    /* ← makes it round */
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-icon svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
    /* optional halo */
    filter: drop-shadow(0 0 1px #fff);
}

.popup-card {
    font-family: system-ui, sans-serif;
    font-size: 14px;
    color: #222;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 8px;
    text-align: center;
    max-width: fit-content;
}

.popup-title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #111;
    white-space: nowrap;
}

.popup-btn {
    font-size: 14px;
    padding: 6px 12px;
    width: 100%;
    /* fill horizontally */
    border-radius: 4px;
    border: none;
    cursor: pointer;
    color: white;
    background-color: #3b82f6;
    transition: background-color 0.2s ease;
}

.popup-btn:hover {
    background-color: #2563eb;
}

.popup-btn.added {
    background-color: #22c55e !important;
}

@keyframes flash {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

.popup-id {
    margin-top: 6px;
    font-size: 12px;
    color: #777;
}
</style>
