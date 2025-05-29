<template>
  <div>
    <!-- simple top-nav -->
    <nav class="nav">
      <RouterLink to="/" class="nav-link" exact-active-class="active">Timetables</RouterLink>
      <span>|</span>
      <RouterLink to="/map" class="nav-link" exact-active-class="active">Map</RouterLink>
    </nav>

    <!-- whichever page the router selects -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.nav {
  display: flex;
  gap: .5rem;
  padding: .75rem 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #dcdcdc;
  font-family: system-ui, sans-serif;
}

.nav-link {
  text-decoration: none;
  color: #0366d6;
}

.nav-link:hover {
  text-decoration: underline;
}

.active {
  font-weight: 600;
  color: #24292f;
}
</style>
