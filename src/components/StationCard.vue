<script setup>
import { onMounted, ref } from 'vue'
import { getDepartures } from '../services/timetableApi'

const props = defineProps({ station: Object })

const departures = ref([])
const loading = ref(true)
const error = ref(null)

async function load() {
    loading.value = true
    error.value = null
    try {
        departures.value = await getDepartures(props.station.id, 10)
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <article class="station-card">
        <h2>{{ props.station.name }}</h2>

        <p v-if="loading">Loading…</p>
        <p v-else-if="error" style="color:#b00">{{ error }}</p>

        <ul v-else class="departure-list">
            <li v-for="d in departures" :key="d.id">
                <span>{{ d.line }} → {{ d.destination }}</span>
                <time class="departure-time" :datetime="d.timeISO">{{ d.time.slice(0, 5) }}</time>
            </li>
        </ul>
    </article>
</template>

<style scoped>
/* same styles as before … */
</style>
