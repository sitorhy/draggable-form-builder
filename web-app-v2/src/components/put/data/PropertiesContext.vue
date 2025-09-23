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
import * as dotProp from 'dot-prop';
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../../types';
import { useBindingStore } from '../../../store/binding';
import { parseUri } from '../../visual/data-source/config';
import { joinPathConfig, splitPathConfig } from '../common/binding-path.ts';
import { useEmptyPropsInjection } from '../common/props.ts';

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	}
});

const bindingStore = useBindingStore();

const bindingPath = inject<ComputedRef<string>>('bindingPath');
const bindingKeys = inject<ComputedRef<string>>('bindingKeys');

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

const obj = ref<Record<string, any>>({});

const binding = computed(() => {
	return props.schema.binding;
});

const loop = computed(() => {
	return props.schema.props?.loop || bindingProps.value.loop;
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
				let isStatic = false;
				const nearestBindingPath = bindingPath?.value;
				if (nearestBindingPath) {
					const parts = splitPathConfig(nearestBindingPath);
					parts.reverse();
					for (let end = parts.length; end >= 0; end--) {
						if (parts[end] && /\[\d+]/.test(parts[end].path)) {
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

				if (bindingValue === undefined) {
					const loop = bindingProps.value['loop'];
					const keys = bindingKeys?.value;
					if (Array.isArray(loop) && Array.isArray(keys)) {
						const nearest = keys[0];
						if (nearest && nearest.key !== null) {
							bindingValue = dotProp.getProperty(
								loop[nearest.key],
								dataSourceSchema.path
							);
						}
					}
					isStatic = true;
				}

				if (bindingValue !== undefined) {
					obj.value = {
						...obj.value,
						[prop]: bindingValue,
						[`onUpdate:${prop}`]: isStatic
							? function () {}
							: function (value: any) {
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
		obj.value['loop'] = loop.value;
	} else {
		delete obj.value['loop'];
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
