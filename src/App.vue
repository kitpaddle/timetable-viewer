<template>
  <div class="app-layout">
    <nav class="nav">
      <div class="nav-left">Last updated at {{ lastUpdated }}</div>
      <div class="nav-center">
        <button class="nav-link nav-toggle" @click="toggleView">
          <component v-if="isOnMap" :is="ClockIcon" class="toggle-icon" />
          <span>{{ isOnMap ? 'View Times' : '➕ Add Stops' }}</span>
        </button>
      </div>
      <div class="nav-right">
        <button class="nav-button theme-btn" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <component :is="isDark ? SunIcon : MoonIcon" class="theme-icon" />
        </button>
        <button class="nav-button" @click="cycleLimit">
          {{ currentLimit }} rows
        </button>
      </div>
    </nav>

    <div class="content">
      <RouterView />
    </div>

    <div class="ad-slot">
      <!-- AdSense ad unit goes here once approved -->
    </div>

    <RouterLink to="/privacy" class="privacy-link">Privacy Policy</RouterLink>

    <div v-if="showIOSPrompt" class="ios-prompt">
      <span>Install this app: tap <strong>Share</strong> <span class="share-icon">⎙</span> then <strong>Add to Home Screen</strong></span>
      <button class="ios-prompt-close" @click="dismissIOSPrompt">✕</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Sun as SunIcon, Moon as MoonIcon, Clock as ClockIcon } from 'lucide-vue-next'
import { useDepartureLimit } from './composables/useDepartureLimit'
import { useStations } from './composables/useStations'
import { useGlobalDepartures } from './composables/useGlobalDepartures'

const { cycleLimit, currentLimit } = useDepartureLimit()
const { lastUpdated, startRefreshTimer } = useGlobalDepartures()

const route = useRoute()
const router = useRouter()
const isOnMap = computed(() => route.path === '/map')
function toggleView() {
  router.push(isOnMap.value ? '/' : '/map')
}

// Theme toggle
const savedTheme = localStorage.getItem('theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)
const isDark = ref(savedTheme === 'dark')

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

// iOS install prompt
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isStandalone = window.navigator.standalone === true
const showIOSPrompt = ref(isIOS && !isStandalone && !localStorage.getItem('iosPromptDismissed'))

function dismissIOSPrompt() {
  showIOSPrompt.value = false
  localStorage.setItem('iosPromptDismissed', '1')
}

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
  background-color: var(--color-nav);
  gap: 0.5rem;
}

.nav-left {
  font-size: 12px;
  color: var(--color-text-muted);
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

.nav-right {
  display: flex;
  gap: 0.4rem;
  flex: 0 0 auto;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: var(--color-nav-link-bg);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: var(--color-nav-link-hover);
  color: var(--color-text);
}

.nav-toggle {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  cursor: pointer;
}

.toggle-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.nav-button {
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: 14px;
  padding: 4px 10px;
  background: var(--color-btn-bg);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  background: var(--color-btn-hover);
}

.theme-btn {
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon {
  width: 15px;
  height: 15px;
}

.privacy-link {
  position: fixed;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--color-text-faint);
  text-decoration: none;
  z-index: 10;
  white-space: nowrap;
}

.privacy-link:hover {
  color: var(--color-text-muted);
}

.ios-prompt {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: #1e293b;
  color: #f0f0f0;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  z-index: 999;
}

.share-icon {
  font-size: 16px;
}

.ios-prompt-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
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
  font-family: system-ui, sans-serif;
}
</style>
