import { ref, watch } from 'vue'

const stored = JSON.parse(localStorage.getItem('stations') || '[]')
const stations = ref(stored)

watch(stations, s => localStorage.setItem('stations', JSON.stringify(s)), {
    deep: true
})

export function useStations() {
    function add(obj) { if (!stations.value.find(s => s.id === obj.id)) stations.value.push(obj) }
    function remove(id) { stations.value = stations.value.filter(s => s.id !== id) }
    return { stations, add, remove }
}
