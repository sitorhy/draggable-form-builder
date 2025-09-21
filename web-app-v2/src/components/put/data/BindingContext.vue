<script setup lang="ts">
import { computed, provide, ref, watch, type PropType } from 'vue';
import {
	resolveContextPath,
	useComponentBindingPath
} from '../common/binding-path.ts';
import type { RendererItemDefinition } from '../../../types.ts';

defineOptions({
	name: 'BindingContext'
});

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	},
	// 绑定路径最高优先级
	customPath: {
		type: String,
		default: null
	},
	// customPath 路径转为数字： ['0'] 和 [0] 的区别，配合bracket使用
	parseNumber: {
		type: Boolean,
		default: false
	},
	// customPath 使用中括号访问 a.b 和 a['b'] 的区别
	bracket: {
		type: Boolean,
		default: false
	},
	// 局部上下文
	componentContext: {
		type: Object,
		default: null
	}
});

const bindingContextPath = computed(() => {
	return resolveContextPath(props);
});

const bindingPathOptions = computed(() => {
	return {
		bracket: props.bracket,
		path: bindingContextPath.value,
		parseNumber: props.parseNumber
	};
});
const { getBindingPath, collectBindingKeys } =
	useComponentBindingPath(bindingPathOptions);
const currentContextBindingPath = ref('');
const bindingPath = computed(() => currentContextBindingPath.value);
const bindingKeys = computed(() => {
	return collectBindingKeys();
});

provide('bindingPath', bindingPath);
provide('bindingKeys', bindingKeys);

watch(
	() => props.schema,
	function () {
		currentContextBindingPath.value = getBindingPath();
	},
	{
		deep: true,
		immediate: true
	}
);

defineExpose({
	bindingContextPath: bindingContextPath.value,
	bindingContextKeys: bindingKeys.value
});
</script>

<template>
	<slot></slot>
</template>
