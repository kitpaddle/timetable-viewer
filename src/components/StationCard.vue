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
const showAllLines = ref(false)

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

function toggleLineWrap() {
    showAllLines.value = !showAllLines.value
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
                <div class="line-toggle-container">
                    <div class="line-toggle-wrapper" :class="{ expanded: showAllLines }">
                        <div class="line-toggles">
                            <button v-for="line in uniqueLines" :key="line" @click="toggleLine(line)"
                                :class="{ active: !hiddenLines.has(line) }">
                                {{ line }}
                            </button>
                        </div>

                    </div>
                    <div class="line-toggle-fade" v-if="!showAllLines"></div>
                    <button class="expand-toggle-btn" v-if="uniqueLines.length > 8" @click="toggleLineWrap">
                        {{ showAllLines ? '−' : '+' }}
                    </button>
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
    flex-wrap: nowrap;
    min-width: 0;
    width: 100%;
}

.card-header h2 {
    flex: 1 1 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.2;
    font-weight: 600;
    min-width: 0;
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
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    color: #ccc;
    stroke-width: 2;
}

.line-toggle-container {
    display: flex;
    flex: 0 3 auto;
    min-width: 0;
    position: relative;
}

.line-toggle-wrapper {
    display: flex;
    justify-content: flex-end;
    /* align horizontally to the right */
    padding-top: 2px;
    /* align rows from the top (default) */
    flex-wrap: wrap;
    /* allow wrapping */
    max-height: 1.8em;
    /* fits 1 row of buttons */
    overflow: hidden;
    transition: max-height 0.3s ease;
    position: relative;    
}

/* When expanded, allow full height */
.line-toggle-wrapper.expanded {
    max-height: 10em;
    /* enough for 3–4 rows */
}

/* The fade overlay itself */
.line-toggle-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5em;
    pointer-events: none;
    background: linear-gradient(to top, #2b2b2b, rgba(43, 43, 43, 0));
    z-index: 1;
}

/* inner button container */
.line-toggles {
    display: inline-block;
    text-align: right;
}

/* toggle expand/collapse button */
.expand-toggle-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 1rem;
    cursor: pointer;
    padding: 0px;
    line-height: 1;
    align-self: center;
    transition: color 0.2s;
}

.expand-toggle-btn:hover {
    color: #fff;
}

.line-toggles button {
    background: #555;
    color: #ddd;
    border: none;
    border-radius: 4px;
    margin: 0 0.25rem 0.25rem 0;
    /* no top/bottom margin */
    padding: 2px 6px;
    line-height: 1.2;
    vertical-align: top;
    font-size: 0.8rem;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
}

.line-toggles button:hover {
    background-color: #3b3b3b;
        color: #c71616;
}

.line-toggles button.active {
    background: #3a4961;
    color: white;
    opacity: 1;
}

</style>


