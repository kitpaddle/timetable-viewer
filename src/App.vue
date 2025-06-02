<template>
  <div>
    <!-- simple top-nav -->
    <nav class="nav">
      <RouterLink to="/" class="nav-link" exact-active-class="active">Timetables</RouterLink>
      <RouterLink to="/map" class="nav-link" exact-active-class="active">➕ Add Stops</RouterLink>
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
  height: 34px;
  display: flex;
  justify-content: center;
  /* center the links */
  gap: 1.5rem;
  padding: 0 0.3rem;
  background-color: #292929;
  /* slightly lighter than #1e1e1e */
  /*border-bottom: 1px solid #444;*/
}

.nav-link {
  text-decoration: none;
  color: #ccc;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: #3b3b3b;
  color: #fff;
}

.nav-link.active {
  background-color: #3a4961;
  /* blue highlight */
  color: #fff;
  font-weight: 600;
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
