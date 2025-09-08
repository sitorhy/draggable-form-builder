<script setup lang="ts">
import { computed, provide } from 'vue';
import { useComponentBindingPath } from '../common/binding-path.ts';

defineOptions({
	name: 'BindingContext'
});

const props = defineProps({
	path: {
		type: String,
		default: ''
	},
	// 路径转为数字： ['0'] 和 [0] 的区别，配合bracket使用
	parseNumber: {
		type: Boolean,
		default: false
	},
	// 使用中括号访问
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

const bindingPathOptions = computed(() => {
	return {
		bracket: props.bracket,
		path: props.path,
		parseNumber: props.parseNumber
	};
});
const { getBindingPath } = useComponentBindingPath(bindingPathOptions);

provide('bindingPath', getBindingPath());
</script>

<template>
	<slot v-bind="$attrs" />
</template>
