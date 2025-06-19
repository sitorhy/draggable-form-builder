import naive from "naive-ui"
import {createApp} from "vue"
import {createPinia} from "pinia"
import "./style.css"
import "vue3-json-viewer/dist/vue3-json-viewer.css";
import App from "./App.vue"

const pinia = createPinia();

createApp(App).use(naive).use(pinia).mount('#app');
