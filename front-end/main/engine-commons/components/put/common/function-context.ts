import { useBindingStore } from '../../../store/binding.ts';
import { computed, type ComputedRef } from 'vue';
import { useReferenceContext } from '../../../store/reference-context.ts';
import { useFunctionStore } from '../../../store/function.ts';

export function useFunctionContext(options: {
	getBindingPath?: () => string;
	getMessageTool?: () =>
		| {
				info: (message: string) => void;
				error: (message: string) => void;
				success: (message: string) => void;
		  }
		| null
		| undefined;
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
			findComponentRef: (subPath: string, tagKey: string) => {
				return referenceContext.findReference(subPath, tagKey);
			},
			getBindingPath() {
				if (typeof options?.getBindingPath === 'function') {
					return options.getBindingPath();
				}
				return undefined;
			},
			loadModuleDescriptionAsync: functionStore.findFunctionCodeByName,
			loadModuleAsync: functionStore.loadModule,
			tryImportModuleSync: (moduleName: string) => {
				return functionStore.tryGetModuleByName(moduleName);
			},
			tools: {
				useMessage() {
					if (options.getMessageTool) {
						return options.getMessageTool();
					}
					return {
						info: console.info,
						error: console.error,
						success: console.log
					};
				}
			}
		};
	});

	return {
		functionContext
	};
}

export function createModuleDefaultExecution(
	moduleName: string,
	funcStore: ReturnType<typeof useFunctionStore>,
	functionContext: ComputedRef<any>
) {
	return function (...args: any[]) {
		let func = funcStore.tryGetDefaultFunctionByModuleName(
			moduleName as string
		);
		if (!func) {
			return (async () => {
				const moduleDescription =
					await funcStore.findFunctionCodeByName(moduleName);
				if (moduleDescription) {
					const module = await funcStore.loadModule(moduleDescription);
					func = module['default'];
					return func.bind(functionContext.value)(...args);
				}
			})();
		}

		if (typeof func === 'function') {
			return func.bind(functionContext.value)(...args);
		}
	};
}
