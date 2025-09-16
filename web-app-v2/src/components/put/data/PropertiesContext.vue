<script setup lang="ts">
/**
 * 标准定义
 * a.b.c: 往上级回溯a变量，命中后依次检索b,c
 */

import { computed, type PropType, provide } from 'vue';
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../../types.ts';

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	}
});

const binding = computed(function () {
	return props.schema?.binding || [];
});

const staticProps = computed(function () {
	return props.schema?.props || {};
});

const propsInjection = computed(() => {
	const obj: Record<string, any> = {};
	binding.value.forEach((binding: NormalizeDataSource) => {
		if (binding.static) {
			obj[binding.prop] = staticProps.value[binding.prop];
		}
	});
	return obj;
});

provide('bindingProps', propsInjection);
</script>

<template>
	<slot></slot>
</template>

<style scoped lang="scss"></style>
