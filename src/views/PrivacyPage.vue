<template>
    <div class="privacy">
        <h1>Privacy Policy</h1>

        <h2>What data is stored</h2>
        <p>
            This app stores your preferences — chosen stops, line filter settings, and map position —
            locally in your browser using localStorage. This data never leaves your device and is
            never accessible to the developer.
        </p>

        <h2>Location</h2>
        <p>
            The "Locate me" button on the map uses your device's GPS/location to centre the map on
            your current position. Your location is never sent to any server — it is used only
            in-browser to set the map view. Your browser will ask for permission once and remember
            your choice; you can revoke it at any time in your browser or device settings.
        </p>

        <h2>What data is collected</h2>
        <p>
            The app itself collects no personal data. No accounts, no analytics, no tracking.
        </p>

        <h2>Advertising</h2>
        <p>
            This app may display ads served by Google AdSense. Google may use cookies to show
            personalised ads based on your browsing activity. For more information, see
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>.
        </p>

        <h2>Third-party services</h2>
        <p>
            Departure data is fetched from <a href="https://www.trafiklab.se" target="_blank" rel="noopener">Trafiklab</a>.
            No personal data is sent in these requests.
        </p>

        <RouterLink to="/map" class="back">← Back</RouterLink>
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
