import { ref, computed } from 'vue'

function defaultLang() {
    const stored = localStorage.getItem('lang')
    if (stored) return stored
    return navigator.language?.toLowerCase().startsWith('sv') ? 'sv' : 'en'
}
const lang = ref(defaultLang())

const strings = {
  sv: {
    addStops:   'Hållplatser',
    viewTimes:  'Tidtabeller',
    updatedAt:  'Uppdaterad',
    locateMe:    'Hitta mig',
    locating:    'Söker…',
    locationErr: 'Plats ej tillgänglig',
    noDepartures: 'Inga avgångar kommande 2 tim',
    addStationBtn: 'Lägg till hållplats',
    stationAdded:  'Hållplats sparad',
    welcomeMain:  'Kom igång genom att trycka på knappen Hållplatser och välj de hållplatser du vill följa.',
    welcomeSub:   'För mer information om funktionerna, tryck på ℹ-knappen uppe till vänster.',
  },
  en: {
    addStops:    'Add Stops',
    viewTimes:   'View Times',
    updatedAt:   'Updated at',
    locateMe:    'Locate me',
    locating:    'Locating…',
    locationErr: 'Location unavailable',
    noDepartures: 'No departures in the next 2 hrs',
    addStationBtn: 'Add stop',
    stationAdded:  'Stop added',
    welcomeMain:  'Get started by pressing the Add Stops button and select the stations you want to see departure times for.',
    welcomeSub:   'For more information about the features, click the ℹ button in the top left corner.',
  }
}

export function useLang() {
  const otherFlag = computed(() => lang.value === 'sv' ? '🇬🇧' : '🇸🇪')

  function toggleLang() {
    lang.value = lang.value === 'sv' ? 'en' : 'sv'
    localStorage.setItem('lang', lang.value)
  }

  function t(key) {
    return strings[lang.value]?.[key] ?? key
  }

  return { lang, otherFlag, toggleLang, t }
}
