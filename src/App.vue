<template>
  <div>
    <nav class="nav">
      <div class="nav-left">Last updated at {{ lastUpdated }}</div>
      <div class="nav-center">
        <RouterLink to="/map" class="nav-link" exact-active-class="active">➕ Add Stops</RouterLink>
        <RouterLink to="/" class="nav-link" exact-active-class="active">Timetables</RouterLink>
      </div>
      <button class="nav-button" @click="cycleLimit">
        {{ currentLimit }} rows
      </button>
    </nav>

    <RouterView />
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useDepartureLimit } from './composables/useDepartureLimit'
import { useStations } from './composables/useStations'
import { useGlobalDepartures } from './composables/useGlobalDepartures'

const { cycleLimit, currentLimit } = useDepartureLimit()

const { lastUpdated, startRefreshTimer } = useGlobalDepartures()

onMounted(() => {
  startRefreshTimer()
})
</script>

<style scoped>
.nav {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.3rem;
  background-color: #292929;
  position: relative;
}

.nav-left {
  position: absolute;
  left: 0.5rem;
  font-size: 12px;
  color: #aaa;
}

.nav-center {
  display: flex;
  gap: 1.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-link {
  text-decoration: none;
  color: #ccc;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #353535;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: #3b3b3b;
  color: #fff;
}

.nav-link.active {
  background-color: #3a4961;
  color: #fff;
  font-weight: 600;
}

.nav-button {
  margin-left: auto;
  font-size: 14px;
  padding: 4px 10px;
  background: #444;
  color: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  background: #666;
}
</style>

<style>
body {
  margin: 0;
  background-color: #414141;
  /* dark gray background */
  color: #f0f0f0;
  /* light text for contrast */
  font-family: system-ui, sans-serif;
}
</style>
