<script setup lang="ts">
import {
	computed,
	type ComputedRef,
	inject,
	onBeforeMount,
	type PropType,
	provide,
	ref,
	watch
} from 'vue';
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../../types';
import { useBindingStore } from '../../../store/binding';
import { parseUri } from '../../visual/data-source/config';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useFunctionStore } from '../../../store/function.ts';

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	}
});

const { emptyBindingPath } = useEmptyBindingPath();
const bindingStore = useBindingStore();
const funcStore = useFunctionStore();

const bindingPath = inject<ComputedRef<string>>(
	'bindingPath',
	emptyBindingPath
);
const formItemBindingPath = inject<ComputedRef<string>>(
	'formItemBindingPath',
	emptyBindingPath
);

const obj = ref<Record<string, any>>({});

const binding = computed(() => {
	return props.schema.binding;
});

async function injectProps(
	prop: string,
	result:
		| {
				source: string;
				value: any;
				fullBindingPath: string;
		  }
		| undefined,
	funNames?: string[]
) {
	if (!funNames) {
		// 同步
		if (result) {
			const { value, fullBindingPath } = result;

			obj.value[prop] = value;
			if (result.source === 'static') {
				obj.value['update:' + prop] = function (value: any) {
					bindingStore.updateStaticContext(fullBindingPath, value);
				};
			} else {
				obj.value['update:' + prop] = function (value: any) {
					bindingStore.updateBinding(fullBindingPath, value);
				};
			}
			return;
		} else {
			delete obj.value[prop];
			delete obj.value['update:' + prop];
		}
	} else {
		// 需要过滤器处理返回值
		const moduleDescriptors = await Promise.all(
			funNames.map(async (name: string) => {
				const module = funcStore.findFunctionCodeByName(name);
				if (!module) {
					console.warn(`Cannot find module '${name}'`);
				}
				return module;
			})
		);
		const modules = await Promise.all(
			moduleDescriptors.filter((i) => !!i).map((m) => funcStore.loadModule(m))
		);

		obj.value[prop] = modules.reduce(
			(acc, module) => {
				const func = module['default'];
				if (typeof func === 'function') {
					return func(acc);
				}
				return acc;
			},
			result ? result.value : undefined
		);
		if (result) {
			const { fullBindingPath } = result;
			if (result.source === 'static') {
				obj.value['update:' + prop] = function (value: any) {
					bindingStore.updateStaticContext(fullBindingPath, value);
				};
			} else {
				obj.value['update:' + prop] = function (value: any) {
					bindingStore.updateBinding(fullBindingPath, value);
				};
			}
		} else {
			delete obj.value['update:' + prop];
		}
	}
}

function resolveLocalSchema(
	prop: string,
	dataSourceSchema: NormalizeDataSource
) {
	const resolvedPath = formItemBindingPath.value || bindingPath.value;
	if (resolvedPath) {
		switch (dataSourceSchema.host) {
			case 'path':
				{
					let funNames;
					const filter = dataSourceSchema.filter;
					if (filter) {
						funNames = filter.split(',');
					}

					let result = bindingStore.searchBinding(
						resolvedPath,
						dataSourceSchema.path
					);
					if (!result) {
						result = bindingStore.searchStaticContext(
							bindingPath.value,
							dataSourceSchema.path
						);
					}

					injectProps(prop, result, funNames);
				}
				break;
		}
	}
}

function resolveBinding() {
	const uriMap = binding.value;
	if (uriMap) {
		Object.keys(uriMap).forEach((prop) => {
			const uri = uriMap[prop];
			const dataSourceSchema = parseUri(uri as string);
			switch (dataSourceSchema.schema) {
				case 'object': {
					resolveLocalSchema(prop, dataSourceSchema);
				}
			}
		});
	}
}

watch(
	bindingStore.state,
	function () {
		resolveBinding();
	},
	{
		immediate: true
	}
);

onBeforeMount(() => {
	resolveBinding();
});

const propsInjection = computed(() => {
	return obj.value;
});

provide('bindingProps', propsInjection);
</script>

<template>
	<slot></slot>
</template>

<style scoped lang="scss"></style>
