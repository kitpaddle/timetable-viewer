import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'   // rename your old App.vue → HomePage.vue
import MapPage from './views/MapPage.vue'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/map', component: MapPage }
    ]
})
