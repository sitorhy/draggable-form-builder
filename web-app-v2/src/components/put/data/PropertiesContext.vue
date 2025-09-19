<script setup lang="ts">
import {
	computed,
	type ComputedRef,
	inject,
	onBeforeMount,
	type PropType,
	provide,
	ref,
	toRaw,
	watch
} from 'vue';
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../../types';
import { useBindingConnector, useBindingStore } from '../../../store/binding';
import { useMessage } from 'naive-ui';
import { parseUri } from '../../visual/data-source/config';
import { joinPathConfig, splitPathConfig } from '../common/binding-path.ts';

const message = useMessage();

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	}
});

const bindingStore = useBindingStore();

const bindingPath = inject<ComputedRef<string>>('bindingPath');
const connectorOptions = computed(() => {
	return {
		path: bindingPath?.value || ''
	};
});
const { queryBinding, updateBinding } = useBindingConnector(connectorOptions, {
	onError: (e: Error) => message.error(e.message)
});

const obj = ref<Record<string, any>>({});

const binding = computed(() => {
	return props.schema.binding;
});

const loop = computed(() => {
	return props.schema.props?.loop;
});

function resolveLocalSchema(
	prop: string,
	dataSourceSchema: NormalizeDataSource
) {
	switch (dataSourceSchema.host) {
		case 'path':
			{
				let fullBindingPath = '';
				let bindingValue = undefined;
				const nearestBindingPath = bindingPath?.value;

				if (nearestBindingPath) {
					const parts = splitPathConfig(nearestBindingPath);
					parts.reverse();
					for (let end = parts.length; end >= 0; end--) {
						if (/\[\d+]/.test(parts[end])) {
							continue;
						}
						const subParts = parts.slice(0, end);
						subParts.reverse();
						const prefix = `${joinPathConfig(subParts)}`;
						const bindingPath = `${prefix}${prefix ? '.' : ''}${dataSourceSchema.path}`;
						bindingValue = bindingStore.queryBinding(bindingPath);
						if (bindingValue !== undefined) {
							fullBindingPath = bindingPath;
							break;
						}
					}
				}

				if (fullBindingPath) {
					obj.value = {
						...obj.value,
						[prop]: bindingValue,
						[`onUpdate:${prop}`]: function (value: any) {
							bindingStore.updateBinding(fullBindingPath, value);
						}
					};
				} else {
					delete obj.value[prop];
					delete obj.value[`update:${prop}`];
				}
			}
			break;
	}
}

function resolveBinding() {
	const uriMap = binding.value;
	if (uriMap) {
		Object.keys(uriMap).forEach((prop) => {
			const uri = uriMap[prop];
			const dataSourceSchema = parseUri(uri);
			switch (dataSourceSchema.schema) {
				case 'object': {
					resolveLocalSchema(prop, dataSourceSchema);
				}
			}
		});
	}
}

function syncListLoop() {
	if (bindingPath?.value && loop.value) {
		updateBinding(structuredClone(toRaw(loop.value) || []));
	}
}

watch(binding, resolveBinding);

watch(bindingStore.root, function () {
	resolveBinding();
});

watch(loop, syncListLoop);

onBeforeMount(function () {
	syncListLoop();
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
