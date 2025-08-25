import type { App } from 'vue';
import ListItem from './components/put/item/ListItem.vue';

export default function registerGlobalComponents(app: App): void {
	app.component('list-item', ListItem);
}
