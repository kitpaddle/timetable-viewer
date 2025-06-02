<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDepartures } from '../services/timetableApi'
import { iconConfig } from '../services/iconConfig.js'
import { useStations } from '../composables/useStations'

const props = defineProps({ station: Object })
const { removeStation } = useStations()  // assumes your composable handles this

const departures = ref([])
const loading = ref(true)
const error = ref(null)

const hiddenLines = ref(new Set()) // line numbers to hide

// Step 1: Filter by transport mode (before anything else)
const modeFiltered = computed(() => {
    const mode = props.station.transportMode
    return departures.value.filter(d => {
        if (mode === 'other') return d.tMode === 'bus'
        return d.tMode === mode
    })
})

// Step 2: Compute unique lines *after* mode filtering
const uniqueLines = computed(() => {
    return [...new Set(modeFiltered.value.map(d => d.line))].sort()
})

// Step 3: Apply line visibility filter and slicing
const filteredDepartures = computed(() => {
    return modeFiltered.value
        .filter(d => !hiddenLines.value.has(d.line))
        .slice(0, 10)
})

function toggleLine(line) {
    if (hiddenLines.value.has(line)) {
        hiddenLines.value.delete(line)
    } else {
        hiddenLines.value.add(line)
    }
}

function getModeIcon() {
    return iconConfig[props.station.transportMode]?.icon || iconConfig.other.icon
}

function remove() {
    removeStation(props.station.uid)
}

onMounted(async () => {
    try {
        departures.value = await getDepartures(props.station.id)
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
})


watch(filteredDepartures, (current) => {
    const cats = new Set(current.map(d => d.tMode))
    console.log('Filtered tMode values:', [...cats])
})


</script>

<template>
    <article class="station-card snap">
        <header class="card-header">
            <div class="station-info">
                <component :is="getModeIcon()" class="icon" />
                <h2>{{ props.station.name }}</h2>
                <div class="card-controls">
                    <div class="line-toggles">
                        <button v-for="line in uniqueLines" :key="line" @click="toggleLine(line)"
                            :class="{ active: !hiddenLines.has(line) }">
                            {{ line }}
                        </button>
                    </div>
                </div>

            </div>
            <button class="close-btn" @click="remove">✕</button>
        </header>

        <p v-if="loading">Loading…</p>
        <p v-else-if="error" style="color:#b00">{{ error }}</p>

        <ul v-else class="departure-list">
            <li v-for="d in filteredDepartures" :key="d.id">
                <span>{{ d.line }} → {{ d.destination }}</span>
                <time class="departure-time" :datetime="d.timeISO">{{ d.time.slice(0, 5) }}</time>
            </li>
        </ul>
    </article>
</template>  

<style scoped>
.station-card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 8px;
  background-color: #2b2b2b;
  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.station-card h2 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #ffffff;
}

.departure-list {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
}

.departure-list li {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    padding-bottom: 4px;
    border-bottom: 1px solid #444;
}

.departure-time {
    font-family: monospace;
    color: #ddd;
}

.snap {
    scroll-snap-align: start;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.station-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card-header h2 {
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.2;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: #f87171;
    /* soft red on hover */
}

.icon {
    width: 20px;
    height: 20px;
    color: #ccc;
    stroke-width: 2;
}

.card-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
}

.line-toggles {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.line-toggles button {
    background: #555;
    color: #ddd;
    border: none;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.8rem;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
}

.line-toggles button.active {
    background: #3a4961;
    color: white;
    opacity: 1;
}

</style>


