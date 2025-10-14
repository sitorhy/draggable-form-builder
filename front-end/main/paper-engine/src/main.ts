import {createApp} from 'vue'
import 'engine-commons/style.css'
import AppContainer from './AppContainer.vue';
import {createPinia} from "pinia";
import naive from 'naive-ui';
import ListItem from './components/put/item/ListItem.vue';
import {createAppRouter} from "./router.ts";
import {type EventCenterForMicroApp} from '@micro-zoe/micro-app';
import {useMicroAppInit} from "./components/put/common/app.ts";

declare global {
    interface Window {
        __MICRO_APP_ENVIRONMENT__: boolean;
        mount: () => void;
        unmount: () => void;
        microApp: EventCenterForMicroApp
    }
}

const pinia = createPinia();
const {router} = createAppRouter();
let app: ReturnType<typeof createApp> | null = null;

function initApp() {
    app = createApp(AppContainer).use(pinia).use(naive);
    app.component('list-item', ListItem);
    app.use(router);
    app.mount('#app');
}

const {onMount, onUnmount} = useMicroAppInit();

window.mount = function () {
    initApp();
    onMount();
};

window.unmount = async () => {
    await onUnmount();
    app?.unmount();
    app = null;
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
    initApp();
}