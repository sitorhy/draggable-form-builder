<script setup lang="ts">
import { computed, type PropType, provide } from 'vue';
import { useComponentBindingPath } from '../common/binding-path.ts';
import type { RendererItemDefinition } from '../../../types.ts';

defineOptions({
	name: 'BindingContext'
});

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	},
	customPath: {
		type: String,
		default: ''
	},
	// customPath 路径转为数字： ['0'] 和 [0] 的区别，配合bracket使用
	parseNumber: {
		type: Boolean,
		default: false
	},
	// customPath 使用中括号访问
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
	const customPath = props.customPath;
	const defaultPath = props.schema.id;
	const bindingPath = props.schema.props?.path;

	if (customPath) {
		return customPath;
	}
	return bindingPath || defaultPath;
});

const bindingPathOptions = computed(() => {
	return {
		bracket: props.bracket,
		path: bindingContextPath.value,
		parseNumber: props.parseNumber
	};
});
const { getBindingPath } = useComponentBindingPath(bindingPathOptions);
const bindingPath = computed(() => getBindingPath());

provide('bindingPath', bindingPath);

defineExpose({
	bindingContextPath: bindingContextPath.value
});
</script>

<template>
	<slot></slot>
</template>
