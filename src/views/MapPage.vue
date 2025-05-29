<script setup>
/* Icons for trains and bus */
import busSvg from 'lucide-static/icons/bus.svg?raw'
import trainSvg from 'lucide-static/icons/train-front.svg?raw'

/* ── static imports (one-time, in bundle) ─────────────────── */
import L from 'leaflet'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'   // plugin IIFE runs immediately

import { onMounted } from 'vue'
import { useStations } from '../composables/useStations'

const { add } = useStations()

onMounted(async () => {
    const L = await import('leaflet')
    await import('leaflet.markercluster')

    const map = L.map('map').setView([59.648, 17.941], 15)              // Sweden
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Lazy-load the JSON
    const stops = await fetch(`${import.meta.env.BASE_URL}stops.min2.json`)
        .then(r => {
            if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
            return r.json()
        })

    const cluster = L.markerClusterGroup()
    stops.forEach(s => {
        const m = L.marker([s.lat, s.lon],{
            icon: icons[s.transportMode] || icons.bus
        }).bindPopup(`<strong>${s.name}</strong><br>ID: ${s.id}<br><button data-id="${s.id}" data-name="${s.name}">Add</button>`)
        cluster.addLayer(m)
    })
    map.addLayer(cluster)

    // Delegate “Add” button clicks
    map.on('popupopen', e => {
        const btn = e.popup.getElement().querySelector('button')
        btn.onclick = () => {
            add({ id: btn.dataset.id, name: btn.dataset.name })
            btn.textContent = '✓ Added'
            btn.disabled = true
        }
    })
})

function makeIcon(svg, color = '#2563eb') {            // default blue
    return L.divIcon({
        html: `<div class="map-icon" style="color:${color}">${svg}</div>`,
        className: '',      // no extra CSS classes
        iconSize: [24, 24],
        iconAnchor: [12, 24] // bottom-centre pin
    })
}

const icons = {
    bus: makeIcon(busSvg, '#22c55e'),
    rail: makeIcon(trainSvg, '#3b82f6')
}

</script>

<template>
    <div style="height:100vh" id="map"></div>
</template>

<style>
@import "https://unpkg.com/leaflet/dist/leaflet.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css";

.map-icon svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
    /* optional halo */
    filter: drop-shadow(0 0 1px #fff);
}
</style>
