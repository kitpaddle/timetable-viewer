import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import MapPage from './views/MapPage.vue'
import PrivacyPage from './views/PrivacyPage.vue'
import AboutPage from './views/AboutPage.vue'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/map', component: MapPage },
        { path: '/privacy', component: PrivacyPage },
        { path: '/about', component: AboutPage }
    ]
})
