import { createApp, defineComponent } from 'vue';
import './style.scss';
import App from './App.vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import registerGlobalComponents from './global-components.ts';

const pinia = createPinia();

const ProviderApp = defineComponent({
	components: {
		App
	},
	template: `
      <n-message-provider>
        <App/>
      </n-message-provider>
    `
});

const app = createApp(ProviderApp).use(pinia).use(naive);

registerGlobalComponents(app);

app.mount('#app');
