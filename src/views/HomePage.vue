<script setup>
import { useStations } from '../composables/useStations'
import StationCard from '../components/StationCard.vue'

const { stations } = useStations()
</script>

<template>
    <main class="container">
        <h1 class="page-title">My Timetable</h1>
        <RouterLink to="/map">➕ Add / remove stops on map</RouterLink>

        <section class="grid">
            <StationCard v-for="s in stations" :key="s.id" :station="s" />
        </section>
    </main>
</template>

<style scoped>
.container {
    max-width: 64rem;
    margin-inline: auto;
    padding: 1rem;
    font-family: system-ui, sans-serif;
}

.page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.grid {
    display: grid;
    gap: 1rem;
}

@media(min-width:640px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media(min-width:1024px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
