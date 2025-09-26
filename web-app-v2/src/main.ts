import { createApp, defineComponent } from 'vue';
import './style.scss';
import App from './App.vue';
import naive from 'naive-ui';
import katex from 'katex';
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
		dateZhCN: () => dateZhCN,
		katex: () => katex
	},
	errorCaptured(e) {
		console.log(e);
	},
	template: `
		<n-notification-provider>
			<n-dialog-provider>
				<n-config-provider :katex="katex" :locale="zhCN" :date-locale="dateZhCN">
					<n-message-provider>
						<App />
					</n-message-provider>
				</n-config-provider>
			</n-dialog-provider>
		</n-notification-provider>
	`
});

const app = createApp(ProviderApp).use(pinia).use(naive);

registerGlobalComponents(app);

app.mount('#app');
