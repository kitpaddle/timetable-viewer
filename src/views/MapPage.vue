<script setup>
import { onMounted } from 'vue'
import { useStations } from '../composables/useStations'

const { add } = useStations()

onMounted(async () => {
    const L = await import('leaflet')
    await import('leaflet.markercluster')

    const map = L.map('map').setView([62, 16], 5)              // Sweden
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // Lazy-load the JSON
    const stops = await fetch('/stops.min.json').then(r => r.json())

    const cluster = L.markerClusterGroup()
    stops.forEach(s => {
        const m = L.marker([s.lat, s.lon])
            .bindPopup(`<strong>${s.name}</strong><br>ID: ${s.id}<br><button data-id="${s.id}" data-name="${s.name}">Add</button>`)
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
</script>

<template>
    <div style="height:100vh" id="map"></div>
</template>

<style>
@import "https://unpkg.com/leaflet/dist/leaflet.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css";
@import "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
