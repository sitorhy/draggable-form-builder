import {createWebHashHistory, createRouter} from 'vue-router'

import App from './App.vue'

export function createAppRouter() {
    const routes = [
        {
            path: '/:pageId?',
            component: App
        }
    ]
    const history = createWebHashHistory();

    return {
        router: createRouter({
            history,
            routes,
        }),
        destroy: () => {
            history.destroy();
        }
    };
}