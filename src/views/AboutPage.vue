<script setup>
import stopsMeta from '/stops-meta.json'
const stopCount = stopsMeta.count.toLocaleString('sv-SE')
</script>

<template>
    <div class="about">
        <h1>Om Avgångar.se</h1>

        <p class="intro">
            Gratis app för realtidsavgångar och tidtabeller för kollektivtrafik i Sverige.
            Inget konto behövs. <RouterLink to="/privacy">Vi sparar ingen persondata.</RouterLink>
        </p>

        <div class="tiles">
            <div class="tile">
                <span class="tile-icon">🗺️</span>
                <div>
                    <strong>{{ stopCount }} hållplatser</strong>
                    <span>Bussar, tåg, tunnelbana, spårvagn och färjor i hela Sverige.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">💾</span>
                <div>
                    <strong>Dina val sparas</strong>
                    <span>Valda hållplatser och inställningar lagras lokalt i webbläsaren.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">🔄</span>
                <div>
                    <strong>Automatisk uppdatering</strong>
                    <span>Sidan uppdateras var 20:e minut — perfekt för större skärmar och magic mirrors.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">📡</span>
                <div>
                    <strong>Realtidsdata</strong>
                    <span>Officiell data från <a href="https://www.trafiklab.se" target="_blank" rel="noopener">Trafiklab</a>. Realtid visas i blått när det finns.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">🌙</span>
                <div>
                    <strong>Ljust / mörkt läge</strong>
                    <span>Växla med sol/måne-knappen uppe till höger.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">🔢</span>
                <div>
                    <strong>Rader-knappen</strong>
                    <span>Styr hur många avgångar som visas per hållplats.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">📍</span>
                <div>
                    <strong>Lägg till hållplatser</strong>
                    <span>Tryck på "Add Stops" för att öppna kartan och hitta hållplatser nära dig.</span>
                </div>
            </div>
            <div class="tile">
                <span class="tile-icon">✕</span>
                <div>
                    <strong>Ta bort hållplatser</strong>
                    <span>Tryck på ✕ i hörnet på ett avgångskort för att ta bort det.</span>
                </div>
            </div>
        </div>

        <RouterLink to="/" class="back">← Tillbaka</RouterLink>
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

.tile a {
    color: var(--color-realtime);
    text-decoration: none;
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
