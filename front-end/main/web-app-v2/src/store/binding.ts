import { defineStore } from 'pinia';
import * as dotProp from 'dot-prop';
import { type ComputedRef, watch } from 'vue';

function findMaxIndex(arr: number[]) {
	if (arr.length === 0) {
		return -1;
	}

	let max = arr[0];
	let maxIndex = 0;

	for (let i = 1; i < arr.length; i++) {
		if ((arr[i] as number) > (max as number)) {
			max = arr[i];
			maxIndex = i;
		}
	}

	return max !== -1 ? maxIndex : -1;
}

export function useBindingConnector(
	options: ComputedRef<{
		path: string;
	}>,
	fallback: {
		onError?: (err: Error) => void;
		onBindingChange?: (newValue: any, oldValue: any) => void;
	} = {}
) {
	const bindingStore = useBindingStore();

	watch(
		() => {
			try {
				return dotProp.getProperty(
					bindingStore.state,
					options.value.path || ''
				);
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
					dotProp.setProperty(bindingStore.state, options.value.path, value);
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
		queryBinding: function (defaultValue: any = null) {
			const val = dotProp.getProperty(bindingStore.state, options.value.path);
			if (val !== undefined) {
				return val;
			}
			return defaultValue;
		}
	};
}

export const useBindingStore = defineStore('binding', {
	state() {
		return {
			staticContext: {} as Record<string, any>,
			state: {}
		};
	},
	getters: {
		staticContextKeys(state) {
			return Object.keys(state.staticContext || {});
		}
	},
	actions: {
		resetStaticContext(context: Record<string, any>) {
			this.staticContext = context;
		},
		assignStaticContext(context: Record<string, any>) {
			Object.assign(this.staticContext, context);
		},
		updateStaticContext: function (
			path: string,
			value: any,
			onError?: (err: Error) => void
		) {
			if (path) {
				try {
					dotProp.setProperty(this.staticContext, path, value);
				} catch (e) {
					if (typeof onError === 'function') {
						onError(e as Error);
					} else {
						throw e;
					}
				}
			}
		},
		searchStaticContext(nearestFullPath: string, objectSubPath: string) {
			if (nearestFullPath) {
				const tryPath = `${nearestFullPath}.${objectSubPath}`;
				// 搜寻最近的上下文字段
				const maxIndexList = this.staticContextKeys.map((key) => {
					return tryPath.lastIndexOf(key);
				});
				const keyIndex = findMaxIndex(maxIndexList);
				if (keyIndex >= 0) {
					const key = this.staticContextKeys[keyIndex];
					const bindingPathPrefix = tryPath
						.split('.')
						.find((p) => p.indexOf(key as string) === 0);
					const fullBindingPath = `${bindingPathPrefix}.${objectSubPath}`;
					const value = dotProp.getProperty(
						this.staticContext,
						fullBindingPath
					);
					if (value !== undefined) {
						return {
							source: 'static',
							value,
							objectSubPath,
							fullBindingPath
						};
					}
				}
			}
			return undefined;
		},
		searchBinding(nearestFullPath: string, objectSubPath: string) {
			const parts = nearestFullPath.split('.');
			for (let end = parts.length; end >= 0; end--) {
				const tryPath = parts.slice(0, end).concat(objectSubPath).join('.');
				const value = dotProp.getProperty(this.state, tryPath);
				if (value) {
					return {
						source: 'state',
						value: value,
						objectSubPath,
						fullBindingPath: tryPath
					};
				}
			}
			return undefined;
		},
		queryBinding: function (path: string, defaultValue?: any) {
			const val = dotProp.getProperty(this.state, path);
			if (val !== undefined) {
				return val;
			}
			return defaultValue;
		},
		updateBinding: function (
			path: string,
			value: any,
			onError?: (err: Error) => void
		) {
			if (path) {
				try {
					dotProp.setProperty(this.state, path, value);
				} catch (e) {
					if (typeof onError === 'function') {
						onError(e as Error);
					} else {
						throw e;
					}
				}
			}
		}
	}
});
