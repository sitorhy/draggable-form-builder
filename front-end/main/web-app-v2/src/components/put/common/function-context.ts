import { useBindingStore } from '../../../store/binding.ts';
import { computed } from 'vue';
import { useReferenceContext } from '../../../store/reference-context.ts';
import { useFunctionStore } from '../../../store/function.ts';

export function useFunctionContext(options: {
	getBindingPath?: () => string;
	message?: {
		info: (message: string) => void;
		error: (message: string) => void;
		success: (message: string) => void;
	};
}) {
	const bindingStore = useBindingStore();
	const referenceContext = useReferenceContext();
	const functionStore = useFunctionStore();

	const functionContext = computed(() => {
		return {
			engine: import.meta.env.VITE_ENGINE,
			getApplicationContext: () => {
				return {
					bindingStore
				};
			},
			findComponentRef: (subPath: string) => {
				return referenceContext.findReference(subPath);
			},
			getBindingPath() {
				if (typeof options?.getBindingPath === 'function') {
					return options.getBindingPath();
				}
				return undefined;
			},
			loadModuleDescriptionAsync: functionStore.findFunctionCodeByName,
			loadModuleAsync: functionStore.loadModule,
			tools: {
				message: {
					info: (text: string) => {
						if (options.message) {
							options.message.info(text);
						}
					},
					error: (text: string) => {
						if (options.message) {
							options.message.error(text);
						}
					},
					success: (text: string) => {
						if (options.message) {
							options.message.success(text);
						}
					}
				}
			}
		};
	});

	return {
		functionContext
	};
}
