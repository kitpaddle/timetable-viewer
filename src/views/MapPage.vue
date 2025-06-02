<script setup>
/* Icons for trains and bus */
import busSvg from 'lucide-static/icons/bus.svg?raw'
import trainSvg from 'lucide-static/icons/train-front.svg?raw'

/* ── static imports (one-time, in bundle) ─────────────────── */
import * as L from 'leaflet' // static import at the top
import 'leaflet.markercluster/dist/leaflet.markercluster.js'   // plugin IIFE runs immediately

import { onMounted, onBeforeUnmount } from 'vue'
import { useStations } from '../composables/useStations'

// Import global Cache
import { stationCache } from '../services/stationCache.js'

// Import icons
import { iconConfig } from '../services/iconConfig.js'


// Acccess Composable
const { addStation } = useStations()

let map
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

    onBeforeUnmount(() => {
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
            addStation({ ...btn._stop })  // Full stop object passed into your store

            // Adding class for animation
            btn.classList.add('added')
            setTimeout(() => btn.classList.remove('added'), 400)
        }
    })

    // Use cache cluster data if available
    if (stationCache.stopCache && stationCache.clusterCache) {
        console.log("Using Cached cluster")
        map.addLayer(stationCache.clusterCache)
        return
    }

    // Lazy-load the JSON
    const stops = await fetch(`${import.meta.env.BASE_URL}stops.min2.json`)
        .then(r => {
            if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
            return r.json()
        })
    stationCache.stopCache = stops
    
    const cluster = L.markerClusterGroup()
    stops.forEach(s => {
        const { svg, color, bg } = iconConfig[s.transportMode] || iconConfig.other
        const m = L.marker([s.lat, s.lon], {
            icon: makeIcon(svg, color, bg)
        })
        m.bindPopup(renderPopup(s))
        m._stop = s // Attaching the object itself to each marker
        cluster.addLayer(m)
    })
    stationCache.clusterCache = cluster
    map.addLayer(cluster)

})

function makeIcon(svg, color = '#2563eb', bg = '#fff') {
    return L.divIcon({
        html: `<div class="map-icon" style="color:${color}; background:${bg}">${svg}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    })
}

function renderPopup(stop) {
    return `
    <div class="popup-card">
      <div class="popup-title">${stop.name}</div>
      <button class="popup-btn">Add Station</button>
      <div class="popup-id">Stop ID: ${stop.id}</div>
    </div>`
}

</script>

<template>
    <div style="height:calc(100vh - 34px)" id="map"></div>
</template>

<style>
@import "https://unpkg.com/leaflet/dist/leaflet.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css";

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
    /* success green */
    animation: flash 0.4s ease;
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
