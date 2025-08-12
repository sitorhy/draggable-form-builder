import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createPinia} from "pinia"

const pinia = createPinia();

createApp(App).use(pinia).use(naive).mount('#app')
