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
            <div v-if="stations.length === 0" class="welcome">
                <p class="welcome-en">
                    Here you can see schedules and real-time departures for most public transport stops in Sweden.
                    Tap <strong>Add Stops</strong> above and choose which stations you wish to see departures for.
                    It will show the next 20 departures, or any departures up to 2 hours from now.
                </p>
                <p class="welcome-sv">
                    Här kan du se tidtabeller och realtidsavgångar för de flesta kollektivtrafikshållplatser i Sverige.
                    Tryck på <strong>Lägg till hållplatser</strong> ovan och välj vilka hållplatser du vill se avgångar för.
                    Visar de nästa 20 avgångarna, eller avgångar upp till 2 timmar från nu.
                </p>
            </div>
            <TransitionGroup v-else name="card" tag="div" :class="['card-grid', stations.length <= 2 ? 'few-cards' : stations.length === 3 ? 'three-cards' : '']">
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

.welcome {
    max-width: 480px;
    margin: 3rem auto;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.welcome-en {
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0;
}

.welcome-sv {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
}
</style>
