import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import ListItem from './components/put/item/ListItem.vue';

const pinia = createPinia();

const app = createApp(App).use(pinia);

app.component('list-item', ListItem);

app.mount('#app')
