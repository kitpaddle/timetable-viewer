// Caches raw stops JSON globally to avoid re-fetching on map revisit.
// Cluster is always rebuilt fresh per map instance to avoid stale Leaflet state.
export const stationCache = {
    stopCache: null
}
  