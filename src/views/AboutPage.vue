<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLang } from '../composables/useLang'

defineProps({ showBack: { type: Boolean, default: true } })

const { lang } = useLang()
const stopCount = ref('69 000')

onMounted(async () => {
    try {
        const meta = await fetch('/stops-meta.json').then(r => r.json())
        stopCount.value = meta.count.toLocaleString(lang.value === 'sv' ? 'sv-SE' : 'en-GB')
    } catch {}
})

const content = computed(() => lang.value === 'sv' ? {
    title: 'Om Avgangar.se',
    intro: 'Gratis app för realtidsavgångar och tidtabeller för kollektivtrafik i Sverige. Inget konto behövs.',
    privacyLink: 'Vi sparar ingen persondata.',
    back: '← Tillbaka',
    tiles: [
        { icon: '🗺️', title: `${stopCount.value} hållplatser`, text: 'Bussar, tåg, tunnelbana, spårvagn och färjor i hela Sverige.' },
        { icon: '💾', title: 'Dina val sparas', text: 'Valda hållplatser och inställningar lagras lokalt i webbläsaren.' },
        { icon: '🔄', title: 'Auto-uppdatering', text: 'Uppdateras var 20:e minut — perfekt för större skärmar och magic mirrors.' },
        { icon: '📡', title: 'Realtidsdata', text: 'Visar max 20 avgångar inom 2 timmar. Realtid visas i blått.' },
        { icon: '🌙', title: 'Ljust / mörkt läge', text: 'Växla med sol/måne-knappen uppe till höger.' },
        { icon: '🔢', title: 'Rader-knappen', text: 'Styr hur många avgångar som visas per hållplats.' },
        { icon: '📍', title: 'Lägg till hållplatser', text: 'Tryck på "Hållplatser" för att öppna kartan och hitta hållplatser nära dig.' },
        { icon: '✕', title: 'Ta bort hållplatser', text: 'Tryck på ✕ i hörnet på ett avgångskort för att ta bort det.' },
        { icon: '📲', title: 'Spara som app', text: 'iOS: tryck Dela → Lägg till på hemskärmen. Android: webbläsarmenyn → Lägg till på startskärmen.' },
    ]
} : {
    title: 'About Avgangar.se',
    intro: 'Free app for real-time departures and timetables for public transport across Sweden. No account needed.',
    privacyLink: 'We store no personal data.',
    back: '← Back',
    tiles: [
        { icon: '🗺️', title: `${stopCount.value} stops`, text: 'Buses, trains, metro, trams and ferries across Sweden.' },
        { icon: '💾', title: 'Your choices are saved', text: 'Chosen stops and settings are stored locally in your browser.' },
        { icon: '🔄', title: 'Auto-refresh', text: 'Refreshes every 20 minutes — great for larger screens and magic mirrors.' },
        { icon: '📡', title: 'Real-time data', text: 'Shows up to 20 departures within the next 2 hours. Real-time shown in blue.' },
        { icon: '🌙', title: 'Light / dark mode', text: 'Toggle with the sun/moon button in the top right.' },
        { icon: '🔢', title: 'Rows button', text: 'Controls how many departures to show per stop.' },
        { icon: '📍', title: 'Add stops', text: 'Tap "Add Stops" to open the map and find stops near you.' },
        { icon: '✕', title: 'Remove stops', text: 'Tap ✕ on a departure card to remove that stop.' },
        { icon: '📲', title: 'Install as app', text: 'iOS: tap Share → Add to Home Screen. Android: browser menu → Add to Home Screen.' },
    ]
})
</script>

<template>
    <div class="about">
        <h1>{{ content.title }}</h1>

        <p class="intro">
            {{ content.intro }}
            <RouterLink to="/privacy">{{ content.privacyLink }}</RouterLink>
        </p>

        <div class="tiles">
            <div class="tile" v-for="tile in content.tiles" :key="tile.title">
                <span class="tile-icon">{{ tile.icon }}</span>
                <div>
                    <strong>{{ tile.title }}</strong>
                    <span>{{ tile.text }}</span>
                </div>
            </div>
        </div>

        <RouterLink v-if="showBack" to="/" class="back">{{ content.back }}</RouterLink>
    </div>
</template>

<style scoped>
.about {
    max-width: 520px;
    margin: 0 auto;
    padding: 1.2rem 1rem 3rem;
    color: var(--color-text);
}

h1 {
    font-size: 1.2rem;
    margin: 0 0 0.6rem;
    color: var(--color-text);
}

.intro {
    font-size: 0.88rem;
    color: var(--color-text-muted);
    margin: 0 0 1rem;
    line-height: 1.5;
}

.intro a {
    color: var(--color-realtime);
    text-decoration: none;
    margin-left: 0.2rem;
}

.tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.tile {
    background: var(--color-surface);
    border-radius: 8px;
    padding: 0.6rem 0.7rem;
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
}

.tile-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 1px;
}

.tile div {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tile strong {
    font-size: 0.8rem;
    color: var(--color-text);
}

.tile span {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.4;
}

.back {
    display: inline-block;
    margin-top: 1.2rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    text-decoration: none;
}

@media (max-width: 400px) {
    .tiles {
        grid-template-columns: 1fr;
    }
}
</style>
