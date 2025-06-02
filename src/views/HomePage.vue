<script setup>
import { useStations } from '../composables/useStations'
import StationCard from '../components/StationCard.vue'

const { stations } = useStations()
</script>

<template>
    <div class="grid-container">
        <main class="grid">
            <StationCard v-for="s in stations" :key="s.uid" :station="s" />
        </main>
    </div>
</template>
  

<style scoped>
.grid-container {
    height: calc(100vh - 34px);
    overflow: hidden;
    box-sizing: border-box;
}

.grid {
    height: 100%;
    display: grid;
    gap: 1rem;
    padding: 1rem;
    /* ✅ spacing INSIDE the grid */
    box-sizing: border-box;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-padding-top: 1rem;

    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
}

@media (min-width: 640px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
    }
}
</style>
