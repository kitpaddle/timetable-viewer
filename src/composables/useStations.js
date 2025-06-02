import { ref, watch } from 'vue'

const stored = JSON.parse(localStorage.getItem('stations') || '[]')
const stations = ref(stored)

watch(stations, s => localStorage.setItem('stations', JSON.stringify(s)), {
    deep: true
})

export function useStations() {
    function addStation(obj) {
        stations.value.push({
            uid: Date.now() + Math.random(),  // ⬅️ unique per instance
            id: obj.id,
            name: obj.name,
            lat: obj.lat,
            lon: obj.lon,
            transportMode: obj.transportMode
        })
        console.log("Adding Station: ", obj.id)
        console.log("TransportMode: ", obj.transportMode)
    }
    function removeStation(uid) {
        console.log("Removing station: ", uid)
        const index = stations.value.findIndex(s => s.uid === uid)
        if (index !== -1) stations.value.splice(index, 1)
    }
      
    return { stations, addStation, removeStation }
}
