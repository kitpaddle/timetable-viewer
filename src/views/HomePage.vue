<script setup>
import { useStations } from '../composables/useStations'
import StationCard from '../components/StationCard.vue'
import { useDepartureLimit } from '../composables/useDepartureLimit'
import { useLang } from '../composables/useLang'

const { stations } = useStations()
const { currentLimit } = useDepartureLimit()
const { t } = useLang()
</script>

<template>
    <div class="grid-container">
        <main class="grid-wrapper">
            <div v-if="stations.length === 0" class="welcome">
                <p class="welcome-main">{{ t('welcomeMain') }}</p>
                <p class="welcome-main">{{ t('welcomeStep2') }}</p>
                <p class="welcome-main">{{ t('welcomeStep3') }}</p>
                <p class="welcome-sub">{{ t('welcomeSub') }}</p>
            </div>
            <TransitionGroup v-else name="card" tag="div" :class="['card-grid', stations.length <= 2 ? 'few-cards' : stations.length === 3 ? 'three-cards' : '']">
                <StationCard v-for="s in stations" :key="s.uid" :station="s" :max-rows="currentLimit" />
            </TransitionGroup>
        </main>
    </div>
</template>
  

<style>
.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    text-align: center;
    max-width: 420px;
    margin: 0 auto;
}

.welcome-main {
    font-size: 1rem;
    color: var(--color-text);
    line-height: 1.6;
    margin: 0;
}

.welcome-sub {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
}

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
