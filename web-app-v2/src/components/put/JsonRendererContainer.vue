<script setup lang="ts">
import draggable from 'vuedraggable';
import JsonRenderer from './JsonRenderer.vue';
import type { RendererItemDefinition } from '../../types.ts';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { useContainerMove } from './common/moveable.ts';
import { computed, type ComputedRef, inject } from 'vue';

defineOptions({
	name: 'JsonRendererContainer'
});

defineProps({
	tag: {
		type: String,
		default: 'div'
	}
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const { containerDragMove } = useContainerMove();

const containerClasses = computed(function () {
	return [
		'renderer-drop',
		'draggable-placeholder',
		schema.value.type,
		!schema.value.children?.length ? 'placeholder-width' : ''
	];
});
</script>

<template>
	<draggable
		ref="containerRef"
		v-if="schema.children"
		:class="containerClasses"
		:tag="tag"
		:move="containerDragMove"
		:group="{ name: 'renderer-container', put: true, pull: true }"
		:data-binding-path="bindingPath"
		:style="schema.props?.style"
		item-key="id"
		ghost-class="ghost"
		drag-class="drag"
		v-model="schema.children"
	>
		<template #item="scope">
			<div>
				<JsonRenderer v-model:schema="schema.children[scope.index]" />
			</div>
		</template>
	</draggable>
	<n-empty v-else description="Container">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
