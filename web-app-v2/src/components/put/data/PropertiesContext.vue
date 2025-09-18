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

function resolveLocalSchema(
	prop: string,
	dataSourceSchema: NormalizeDataSource
) {
	switch (dataSourceSchema.host) {
		case 'path':
			{
				const fullBindingPath = dataSourceSchema.path;
				obj.value = {
					...obj.value,
					[prop]: bindingStore.queryBinding(fullBindingPath),
					[`update:${prop}`]: function (value: any) {
						bindingStore.updateBinding(fullBindingPath, value);
					}
				};
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

watch(binding, resolveBinding);

watch(bindingStore.root, function () {
	resolveBinding();
});

onBeforeMount(function () {
	const loop = props.schema.props?.loop;
	if (bindingPath?.value) {
		if (loop) {
			const staticValue = queryBinding();
			if (!staticValue) {
				updateBinding(structuredClone(toRaw(loop)));
			}
		}
	}

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
