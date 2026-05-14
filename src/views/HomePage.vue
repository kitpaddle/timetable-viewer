<script setup>
import { useStations } from '../composables/useStations'
import StationCard from '../components/StationCard.vue'
import { useDepartureLimit } from '../composables/useDepartureLimit'

const { stations } = useStations()
const { currentLimit } = useDepartureLimit()
</script>

<template>
    <div class="grid-container">
        <main class="grid-wrapper">
            <TransitionGroup name="card" tag="div" :class="['card-grid', stations.length <= 2 ? 'few-cards' : stations.length === 3 ? 'three-cards' : '']">
                <StationCard v-for="s in stations" :key="s.uid" :station="s" :max-rows="currentLimit" />
            </TransitionGroup>
        </main>
    </div>
</template>
  

<style>
.grid-container {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.grid-wrapper {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    scroll-snap-type: y mandatory;
    scroll-padding-top: 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
}

.card-grid {
    display: grid;
    gap: 1rem;
    width: 100%;
    margin: 0 auto;
    max-width: calc(100vw - 2rem);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    align-content: start;
}

@media (min-width: 600px) {
    .card-grid {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
}

.card-leave-active {
    transition: opacity 0.5s ease;
}

.card-leave-from {
    opacity: 1;
}

.card-leave-to {
    opacity: 0;
}

@media (min-width: 768px) {
    .few-cards .station-card h2 {
        font-size: 2rem;
    }

    .few-cards .departure-row {
        font-size: 1.25rem;
    }

    .few-cards .departure-line,
    .few-cards .departure-time-container {
        font-size: 1.8rem;
    }

    .few-cards .departure-destination {
        font-size: 1.6rem;
    }

    .three-cards .station-card h2 {
        font-size: 1.5rem;
    }

    .three-cards .departure-row {
        font-size: 1.1rem;
    }

    .three-cards .departure-line,
    .three-cards .departure-time-container {
        font-size: 1.3rem;
    }

    .three-cards .departure-destination {
        font-size: 1.2rem;
    }
}
</style>
