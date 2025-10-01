<script setup lang="ts">
import type { RendererItemDefinition } from '../../types.ts';
import { computed } from 'vue';

defineOptions({
	name: 'JsonRendererItemContainer'
});

defineProps({
	dataBindingPath: {
		type: String,
		default: ''
	}
});

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const style = computed(() => {
	return schema.value.props?.style;
});
</script>

<template>
	<div
		:class="['renderer-item-container']"
		:style="style"
		:data-binding-path="dataBindingPath"
	>
		<slot></slot>
	</div>
</template>
