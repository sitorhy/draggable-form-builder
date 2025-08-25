<script setup lang="ts">
import draggable from 'vuedraggable';
import JsonRenderer from './JsonRenderer.vue';
import type { RendererItemDefinition } from '../../types.ts';
import { ErrorCircle20Regular } from '@vicons/fluent';
import { useContainerMove } from './common/moveable.ts';
import { inject } from 'vue';

defineOptions({
	name: 'JsonRendererContainer'
});

defineProps({
	tag: {
		type: String,
		default: 'div'
	}
});

const bindingPath = inject<string>('bindingPath', '');

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const { containerDragMove } = useContainerMove();
</script>

<template>
	<draggable
		v-if="schema.children"
		:class="[
			'renderer-drop',
			schema.type,
			'draggable-emphasized',
			!schema.children?.length ? 'placeholder-width' : ''
		]"
		:tag="tag"
		:move="containerDragMove"
		:group="{ name: 'renderer-container', put: true, pull: true }"
		item-key="id"
		:data-binding-path="bindingPath"
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

<style scoped>
.placeholder-width {
	min-width: var(--n-width);
}
</style>
