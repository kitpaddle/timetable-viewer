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
    searchPlaceholder: 'Sök hållplats…',
    addStationBtn: 'Lägg till hållplats',
    stationAdded:  'Hållplats sparad',
    welcomeMain:  'Kom igång genom att trycka på knappen Hållplatser och välj de hållplatser du vill följa.',
    welcomeStep2: 'När du lagt till en eller flera hållplatser trycker du på Tidtabeller för att se dina avgångar live.',
    welcomeStep3: 'Du kan sedan anpassa dem som du vill – dina val sparas till nästa besök.',
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
    searchPlaceholder: 'Search stop…',
    addStationBtn: 'Add stop',
    stationAdded:  'Stop added',
    welcomeMain:  'Get started by pressing the Add Stops button and select the stations you want to see departure times for.',
    welcomeStep2: 'After adding one or more stations, click View Times to see your stations live.',
    welcomeStep3: 'You can then customize them as you wish, and they will be remembered for your next visit.',
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
