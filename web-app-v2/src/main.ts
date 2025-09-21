import { createApp, defineComponent } from 'vue';
import './style.scss';
import App from './App.vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import registerGlobalComponents from './global-components.ts';

import { zhCN, dateZhCN } from 'naive-ui';

const pinia = createPinia();

const ProviderApp = defineComponent({
	components: {
		App
	},
	computed: {
		zhCN: () => zhCN,
		dateZhCN: () => dateZhCN
	},
	errorCaptured(e) {
		console.log(e);
	},
	template: `
		<n-dialog-provider>
			<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
				<n-message-provider>
					<App />
				</n-message-provider>
			</n-config-provider>
		</n-dialog-provider>
	`
});

const app = createApp(ProviderApp).use(pinia).use(naive);

registerGlobalComponents(app);

app.mount('#app');
