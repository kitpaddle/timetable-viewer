
// This is to refresh the departure data globally every 20mins

import { ref } from 'vue'

// composables/useGlobalDepartures.js
import { ref } from 'vue'

const lastUpdated = ref(null)
const refreshTrigger = ref(0) // reactive signal

export function useGlobalDepartures() {
    const REFRESH_INTERVAL = 1000 * 60 * 20 // 20 minutes

    function updateTimestamp() {
        const now = new Date()
        lastUpdated.value = now.toTimeString().slice(0, 5) // "HH:MM"
    }

    function startRefreshTimer() {
        updateTimestamp()
        refreshTrigger.value++ // signal refresh
        setInterval(() => {
            refreshTrigger.value++
            updateTimestamp()
        }, REFRESH_INTERVAL)
    }

    return {
        lastUpdated,
        refreshTrigger,
        startRefreshTimer
    }
}


