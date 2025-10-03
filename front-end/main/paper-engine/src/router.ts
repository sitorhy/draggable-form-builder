import { createWebHistory, createRouter } from 'vue-router'

import App from './App.vue'

const routes = [
    {
        path: '/:pageId?',
        component: App
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
});