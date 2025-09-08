<script setup lang="ts">
import { computed } from 'vue';
import { useRendererContainerEmphasize } from './common/container-emphasize.ts';
import { useEmphasizeStore } from '../../store/emphasize.ts';

defineOptions({
	name: 'JsonEmphasizeContainer'
});

const props = defineProps({
	schemaId: {
		type: String,
		default: ''
	}
});

const emphasizeStore = useEmphasizeStore();

const emphasizeOptions = computed(() => {
	return {
		schemaId: props.schemaId
	};
});
const { containerRef, containerSizeStyle, onContainerClick } =
	useRendererContainerEmphasize(emphasizeOptions);

const containerClasses = computed(function () {
	return [
		emphasizeStore.schemaId === props.schemaId ? 'draggable-emphasized' : ''
	];
});
</script>

<template>
	<div
		:class="containerClasses"
		:style="containerSizeStyle"
		ref="containerRef"
		@click.stop="onContainerClick"
	>
		<slot></slot>
	</div>
</template>
