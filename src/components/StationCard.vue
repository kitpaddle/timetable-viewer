<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getDepartures } from '../services/timetableApi'
import { iconConfig } from '../services/iconConfig.js'
import { useStations } from '../composables/useStations'
import { useGlobalDepartures } from '../composables/useGlobalDepartures'
import { useLang } from '../composables/useLang'

const props = defineProps({ 
    station: Object,
    maxRows: {
        type: Number,
        default: 10
    }
 })
const { removeStation } = useStations()
const { t } = useLang()

const departures = ref([])
const loading = ref(true)
const error = ref(null)
const showAllLines = ref(false)
const lineWrapperRef = ref(null)
const overflowDetected = ref(false)

const HIDDEN_LINES_KEY = `hiddenLines_${props.station.id}`
const hiddenLines = ref(new Set(JSON.parse(localStorage.getItem(HIDDEN_LINES_KEY) || '[]')))

watch(hiddenLines, val => {
    localStorage.setItem(HIDDEN_LINES_KEY, JSON.stringify([...val]))
}, { deep: true })
const { refreshTrigger } = useGlobalDepartures()

// Step 1: Filter by transport mode (before anything else)
const modeFiltered = computed(() => {
    const mode = props.station.transportMode
    if (mode === 'other') return departures.value
    return departures.value.filter(d => d.tMode === mode)
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
            <p v-else-if="filteredDepartures.length === 0" class="no-departures">{{ t('noDepartures') }}</p>

            <TransitionGroup name="departure" tag="ul" class="departure-list" v-if="!loading && !error">
                <li v-for="d in filteredDepartures" :key="d.id" class="departure-row">
                    <span class="departure-line">{{ d.line }}</span>
                    <span class="departure-destination">{{ d.destination }}</span>
                    <div class="departure-time-container">
                        <time class="departure-time" :class="{ dimmed: d.isRealtime }" :datetime="d.timeISO">{{ d.time }}</time>
                        <span v-if="d.isRealtime" class="realtime-time">{{ d.realtimeTime }}</span>
                    </div>
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
  color: var(--color-text);
  display: flex;
  flex-direction: column;
}

.station-card h2 {
    font-size: 1.5rem;
    color: var(--color-text);
}

.list-container {
    padding: 1rem;
    background-color: var(--color-surface);
    margin: 0;
    border-radius: 0 0 8px 8px;
    transition: none;
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
  display: none;
}

.departure-row {
    display: flex;
    align-items: center;
    font-size: 1rem;
    border-bottom: 1px solid var(--color-border);
    padding: 4px 0;
    gap: 0.5rem;
}

.departure-line {
    flex: 0 0 4ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 600;
    color: var(--color-text-secondary);
}

.departure-destination {
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--color-text);
}

.departure-time-container {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: monospace;
}

.realtime-time {
    font-weight: bold;
    color: var(--color-realtime);
}

.departure-time {
    color: var(--color-text-secondary);
    text-align: right;
    white-space: nowrap;
}

.departure-time.dimmed {
    color: var(--color-text-faint);
    text-decoration: line-through;
}

.no-departures {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    margin: 0;
    padding: 0.25rem 0;
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
    background-color: var(--color-surface-raised);
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
    color: var(--color-text-muted);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.25rem 0.25rem 0.25rem 1.5rem;
    line-height: 1;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: var(--color-danger);
}

.icon {
    flex: 0 0 auto;
    width: 24px;
    height: 24px;
    color: var(--color-text-secondary);
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
    padding-top: 2px;
    flex-wrap: wrap;
    max-height: 1.7em;
    overflow: hidden;
    position: relative;
}

.line-toggle-wrapper.expanded {
    max-height: 10em;
}

.line-toggle-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5em;
    pointer-events: none;
    background: linear-gradient(to top, var(--color-surface-raised), transparent);
    z-index: 1;
}

.line-toggles {
    display: inline-block;
    text-align: right;
}

.expand-toggle-btn {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 1rem;
    cursor: pointer;
    padding: 0px;
    line-height: 1;
    align-self: center;
    transition: color 0.2s;
}

.expand-toggle-btn:hover {
    color: var(--color-text);
}

.line-toggles button {
    background: var(--color-line-toggle-bg);
    color: var(--color-text-secondary);
    border: none;
    border-radius: 4px;
    margin: 0 0.25rem 0.25rem 0;
    padding: 2px 6px;
    line-height: 1.2;
    vertical-align: top;
    font-size: 0.8rem;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
}

.line-toggles button:hover {
    background-color: var(--color-nav-link-hover);
    color: var(--color-danger);
}

.line-toggles button.active {
    background: var(--color-active);
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


