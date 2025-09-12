import { defineStore } from 'pinia';
import * as dotProp from 'dot-prop';
import { type ComputedRef, watch } from 'vue';

export function useBindingConnector(
	options: ComputedRef<{
		path: string;
	}>,
	fallback: {
		onError?: (err: Error) => void;
		onBindingChange?: (newValue: any, oldValue: any) => void;
	}
) {
	const bindingStore = useBindingStore();

	watch(
		() => {
			try {
				return dotProp.getProperty(bindingStore.root, options.value.path || '');
			} catch (e) {
				console.error(e);
				if (typeof fallback.onError === 'function') {
					fallback.onError(e as Error);
				} else {
					throw e;
				}
			}
		},
		function (newValue, oldValue) {
			if (typeof fallback.onBindingChange === 'function') {
				fallback.onBindingChange(newValue, oldValue);
			}
		},
		{
			deep: true
		}
	);

	return {
		updateBinding: function (value: any) {
			if (options.value.path) {
				try {
					dotProp.setProperty(bindingStore.root, options.value.path, value);
				} catch (e) {
					console.error(e);
					if (typeof fallback.onError === 'function') {
						fallback.onError(e as Error);
					} else {
						throw e;
					}
				}
			}
		},
		queryBinding: function () {
			return dotProp.getProperty(bindingStore.root, options.value.path);
		}
	};
}

export const useBindingStore = defineStore('binding', {
	state() {
		return {
			root: {}
		};
	}
});
