import {createApp} from 'vue'
import './style.css'
import AppContainer from './AppContainer.vue';
import {createPinia} from "pinia";
import ListItem from './components/put/item/ListItem.vue';

const pinia = createPinia();

const app = createApp(AppContainer).use(pinia);

app.component('list-item', ListItem);

app.mount('#app')
