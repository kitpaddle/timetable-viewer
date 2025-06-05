<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getDepartures } from '../services/timetableApi'
import { iconConfig } from '../services/iconConfig.js'
import { useStations } from '../composables/useStations'
import { useGlobalDepartures } from '../composables/useGlobalDepartures'

const props = defineProps({ 
    station: Object,
    maxRows: {
        type: Number,
        default: 10
    }
 })
const { removeStation } = useStations()  // assumes your composable handles this

const departures = ref([])
const loading = ref(true)
const error = ref(null)
const showAllLines = ref(false)
const lineWrapperRef = ref(null)
const overflowDetected = ref(false)
const hiddenLines = ref(new Set()) // line numbers to hide
const { refreshTrigger } = useGlobalDepartures()

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
        .slice(0, props.maxRows)
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

function checkOverflow() {
    nextTick(() => {
        const el = lineWrapperRef.value
        if (el) {
            // Temporarily remove 'expanded' class to check actual overflow
            const wasExpanded = showAllLines.value
            if (wasExpanded) el.classList.remove('expanded')

            overflowDetected.value = el.scrollHeight > el.clientHeight

            if (wasExpanded) el.classList.add('expanded')
        }
    })
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
        checkOverflow()
    }
})


watch(filteredDepartures, (current) => {
    const cats = new Set(current.map(d => d.tMode))
    console.log('Filtered tMode values:', [...cats])
})

watch(uniqueLines, checkOverflow)
watch(showAllLines, checkOverflow)

watch(refreshTrigger, async () => {
    try {
        departures.value = await getDepartures(props.station.id)
    } catch (e) {
        error.value = e.message
    } finally {
        checkOverflow()
    }
})

</script>

<template>
    <article class="station-card snap">

        <header class="card-header">
            <div class="station-info">
                <component :is="getModeIcon()" class="icon" />
                <h2>{{ props.station.name }}</h2>
                <div class="line-toggle-container">
                    <div ref="lineWrapperRef" class="line-toggle-wrapper" :class="{ expanded: showAllLines }">
                        <div class="line-toggles">
                            <button v-for="line in uniqueLines" :key="line" @click="toggleLine(line)"
                                :class="{ active: !hiddenLines.has(line) }">
                                {{ line }}
                            </button>
                        </div>

                    </div>
                    <div class="line-toggle-fade" v-if="overflowDetected && !showAllLines"></div>
                    <button class="expand-toggle-btn" v-if="overflowDetected" @click="toggleLineWrap">
                        {{ showAllLines ? '▲' : '▼' }}
                    </button>
                </div>
            </div>
            <button class="close-btn" @click="remove">✕</button>
        </header>
        <div class="list-container">
            <p v-if="loading">Loading…</p>
            <p v-else-if="error" style="color:#b00">{{ error }}</p>

            <TransitionGroup name="departure" tag="ul" class="departure-list" v-if="!loading && !error">
                <li v-for="d in filteredDepartures" :key="d.id" class="departure-row">
                    <span class="departure-line">{{ d.line }}</span>
                    <span class="departure-destination">{{ d.destination }}</span>
                    <time class="departure-time" :datetime="d.timeISO">{{ d.time.slice(0, 5) }}</time>
                </li>
            </TransitionGroup>
        </div>
    </article>
</template>  

<style scoped>
.station-card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  color: #f0f0f0;
  display: flex;
  flex-direction: column;
  
  
}

.station-card h2 {
    font-size: 1.5rem;
    color: #ffffff;
}

.list-container {
    padding: 1rem 1rem 1rem 1rem;
    background-color: #272626;
    margin: 0;
    border-radius: 0 0 8px 8px;
    transition: none; /*max-height 0.3s ease;*/
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
    scrollbar-width: none;
    overflow-anchor: none;
}

.departure-list::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.departure-row {
    display: flex;
    align-items: center;
    font-size: 1rem;
    border-bottom: 1px solid #444;
    padding: 4px 0;
    gap: 0.5rem;
}

.departure-line {
    flex: 0 0 4ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #ccc;
}

.departure-destination {
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #eee;
}

.departure-time {
    flex: 0 0 3.5ch;
    /* Enough for 5 characters: HH:MM */
    font-family: monospace;
    color: #ddd;
    text-align: right;
}

.snap {
    scroll-snap-align: start;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 8px 8px 0 0;
    background-color: #2b2b2b;
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
    padding: 0.25rem 0.25rem 0.25rem 1.5rem;
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
    flex: 0 8 auto;
    min-width: 0;
    position: relative;
}

.line-toggle-wrapper {
    display: flex;
    justify-content: flex-start;
    /* align horizontally to the right */
    padding-top: 2px;
    /* align rows from the top (default) */
    flex-wrap: wrap;
    /* allow wrapping */
    max-height: 1.7em;
    /* fits 1 row of buttons */
    overflow: hidden;
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

/* Departure row enter/leave transition
.departure-enter-active,
.departure-leave-active {
    transition: all 0.3s ease;
}

.departure-enter-from {
    opacity: 0;
}

.departure-enter-to {
    opacity: 1;
}

.departure-leave-from {
    opacity: 1;
}

.departure-leave-to {
    opacity: 0;
}
    */
</style>


