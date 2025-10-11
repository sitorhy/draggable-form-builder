import { useBindingStore } from '../../../store/binding';
import { computed } from 'vue';

export function useFunctionContext() {
	const bindingStore = useBindingStore();
	const functionContext = computed(() => {
		return {
            engine: import.meta.env.VITE_ENGINE,
			getApplicationContext: () => {
				return {
					bindingStore
				};
			}
		};
	});

	return {
		functionContext
	};
}
