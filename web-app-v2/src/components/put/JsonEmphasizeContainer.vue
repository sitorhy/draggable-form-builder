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
	},
	tag: {
		type: String,
		default: ''
	},
	containerStyle: {
		type: Object,
		default: null
	}
});

const emphasizeStore = useEmphasizeStore();

const emphasizeOptions = computed(() => {
	return {
		schemaId: props.schemaId,
		containerStyle: props.containerStyle
	};
});
const { containerRef, containerSizeStyle, onContainerClick } =
	useRendererContainerEmphasize(emphasizeOptions);

const containerClasses = computed(function () {
	return [
		'emphasized-container',
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
		<component :is="tag" v-if="tag">
			<slot></slot>
		</component>
		<slot v-else></slot>
	</div>
</template>

<style lang="scss" scoped>
.emphasized-container {
	position: relative;
	width: 100%;
	height: fit-content;
}
</style>
