<template>
  <div class="app-layout">
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

    <div class="content">
      <RouterView />
    </div>

    <div class="ad-slot">
      <!-- AdSense ad unit goes here once approved -->
    </div>
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
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.ad-slot {
  display: none; /* unhide and paste AdSense <ins> tag inside when approved */
}

.nav {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  background-color: #292929;
  gap: 0.5rem;
}

.nav-left {
  font-size: 12px;
  color: #aaa;
  flex: 0 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.nav-center {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
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
  flex: 0 0 auto;
  white-space: nowrap;
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

@media (max-width: 600px) {
  .nav-left {
    white-space: normal;
    font-size: 9px;
    line-height: 1.2;
    flex: 0 0 auto;
    max-width: 60px;
  }

  .nav-link {
    font-size: 14px;
    padding: 4px 8px;
  }
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
