<script setup>
import { computed, onMounted } from 'vue'
import { useLang } from '../composables/useLang'
const { lang } = useLang()

onMounted(() => {
    document.title = lang.value === 'sv'
        ? 'Integritetspolicy – Avgangar.se'
        : 'Privacy Policy – Avgangar.se'
})

const content = computed(() => lang.value === 'sv' ? {
    title: 'Integritetspolicy',
    stored: { h: 'Vad lagras', p: 'Appen sparar dina val — valda hållplatser, linjefilter och kartposition — lokalt i webbläsaren via localStorage. Denna data lämnar aldrig din enhet och är aldrig tillgänglig för utvecklaren.' },
    location: { h: 'Platsdata', p: '"Hitta mig"-knappen på kartan använder enhetens GPS för att centrera kartan. Din plats skickas aldrig till någon server — den används bara lokalt för att ställa in kartvyn. Webbläsaren frågar om tillstånd en gång och kommer ihåg ditt val; du kan återkalla det när som helst i webbläsar- eller enhetsinställningarna.' },
    collected: { h: 'Vad samlas in', p: 'Appen samlar inte in någon persondata. Inga konton, ingen analys, ingen spårning.' },
    ads: { h: 'Reklam', p: 'Appen kan visa annonser från Google AdSense. Google kan använda cookies för att visa anpassade annonser baserat på din webbaktivitet. Mer information finns i', linkText: 'Googles integritetspolicy' },
    third: { h: 'Tredjepartstjänster', p: 'Avgångsdata hämtas från', linkText: 'Trafiklab', p2: '. Ingen persondata skickas i dessa förfrågningar.' },
    back: '← Tillbaka'
} : {
    title: 'Privacy Policy',
    stored: { h: 'What data is stored', p: 'This app stores your preferences — chosen stops, line filter settings, and map position — locally in your browser using localStorage. This data never leaves your device and is never accessible to the developer.' },
    location: { h: 'Location', p: 'The "Locate me" button on the map uses your device\'s GPS to centre the map on your current position. Your location is never sent to any server — it is used only in-browser to set the map view. Your browser will ask for permission once and remember your choice; you can revoke it at any time in your browser or device settings.' },
    collected: { h: 'What data is collected', p: 'The app itself collects no personal data. No accounts, no analytics, no tracking.' },
    ads: { h: 'Advertising', p: 'This app may display ads served by Google AdSense. Google may use cookies to show personalised ads based on your browsing activity. For more information, see', linkText: 'Google\'s Privacy Policy' },
    third: { h: 'Third-party services', p: 'Departure data is fetched from', linkText: 'Trafiklab', p2: '. No personal data is sent in these requests.' },
    back: '← Back'
})
</script>

<template>
    <div class="privacy">
        <h1>{{ content.title }}</h1>

        <h2>{{ content.stored.h }}</h2>
        <p>{{ content.stored.p }}</p>

        <h2>{{ content.location.h }}</h2>
        <p>{{ content.location.p }}</p>

        <h2>{{ content.collected.h }}</h2>
        <p>{{ content.collected.p }}</p>

        <h2>{{ content.ads.h }}</h2>
        <p>{{ content.ads.p }} <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">{{ content.ads.linkText }}</a>.</p>

        <h2>{{ content.third.h }}</h2>
        <p><a href="https://www.trafiklab.se" target="_blank" rel="noopener">{{ content.third.linkText }}</a>{{ content.third.p2 }}</p>

        <RouterLink to="/about" class="back">{{ content.back }}</RouterLink>
    </div>
</template>

<style scoped>
.privacy {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
    color: var(--color-text);
    line-height: 1.7;
}

h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--color-text);
}

h2 {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin-top: 1.5rem;
    margin-bottom: 0.4rem;
}

p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--color-text-muted);
}

a {
    color: var(--color-realtime);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.back {
    display: inline-block;
    margin-top: 2rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
}
</style>
