import { ref, computed } from 'vue'

const lang = ref(localStorage.getItem('lang') || 'sv')

const strings = {
  sv: {
    addStops:   'Hållplatser',
    viewTimes:  'Tidtabeller',
    updatedAt:  'Uppdaterad',
    locateMe:   'Hitta mig',
    locating:   'Söker…',
    locationErr:'Plats ej tillgänglig',
  },
  en: {
    addStops:   'Add Stops',
    viewTimes:  'View Times',
    updatedAt:  'Updated at',
    locateMe:   'Locate me',
    locating:   'Locating…',
    locationErr:'Location unavailable',
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
