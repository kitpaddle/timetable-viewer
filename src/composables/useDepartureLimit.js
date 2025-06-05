//This is where I set the rows i can cycle through

import { ref, computed } from 'vue'

const limits = [5, 10, 15, 20]
const index = ref(0)

export function useDepartureLimit() {
    const currentLimit = computed(() => limits[index.value])
    const cycleLimit = () => {
        index.value = (index.value + 1) % limits.length
    }

    return {
        currentLimit,
        cycleLimit
    }
}
