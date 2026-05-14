
// Refreshes departure data every 20 minutes and immediately when the tab becomes visible again

import { ref } from 'vue'

const lastUpdated = ref(null)
const refreshTrigger = ref(0)

export function useGlobalDepartures() {
    const REFRESH_INTERVAL = 1000 * 60 * 20 // 20 minutes

    function updateTimestamp() {
        const now = new Date()
        lastUpdated.value = now.toTimeString().slice(0, 5)
    }

    function triggerRefresh() {
        refreshTrigger.value++
        updateTimestamp()
    }

    function startRefreshTimer() {
        triggerRefresh()
        setInterval(triggerRefresh, REFRESH_INTERVAL)

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                triggerRefresh()
            }
        })
    }

    return {
        lastUpdated,
        refreshTrigger,
        startRefreshTimer
    }
}


