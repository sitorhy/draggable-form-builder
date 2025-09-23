<script setup lang="ts">
import { computed, type ComputedRef, inject, type PropType } from 'vue';
import BindingContext from './data/BindingContext.vue';
import JsonRenderer from './JsonRenderer.vue';
import draggable from 'vuedraggable';
import type { RendererItemDefinition } from '../../types.ts';
import { useContainerMove } from './common/moveable.ts';
import { joinPathConfig, getCurrentPathConfig } from './common/binding-path.ts';
import { useEmptyPropsInjection } from './common/props.ts';

defineOptions({
	name: 'JsonRendererList'
});

defineProps({
	tag: {
		// 容器组件
		type: String,
		default: 'div'
	},
	pull: {
		type: Boolean,
		default: true
	},
	put: {
		type: Boolean,
		default: true
	},
	componentData: {
		// 附加属性（DOM） / 容器组件Props（Custom Component）
		type: Object,
		default: () => ({})
	},
	loop: {
		type: Array as PropType<Record<string, any>>,
		default: () => []
	}
});

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
	'bindingProps',
	emptyPropsInjection
);

const propsReduce = computed(() => ({
	...schema.value.props,
	...bindingProps.value
}));

const bindingPath = inject<ComputedRef<string>>('bindingPath');

function createItemBindingPath(index: number) {
	return (
		bindingPath?.value +
		joinPathConfig([
			getCurrentPathConfig({
				bracket: true,
				path: String(index),
				parseNumber: true
			})
		])
	);
}

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
	<div
		class="renderer-drop draggable-placeholder"
		v-if="!propsReduce.loop || !propsReduce.loop.length"
	>
		<!--占位-->
	</div>
	<BindingContext
		v-else
		v-for="(item, index) in propsReduce.loop"
		:schema="schema"
		:key="createItemBindingPath(index)"
		:bracket="true"
		:parse-number="true"
		:custom-path="`${index}`"
		:component-context="item"
	>
		<draggable
			v-if="schema.children"
			v-emphasize:schemaId="schema.id"
			ref="containerRef"
			:class="containerClasses"
			:group="{ name: 'renderer-list', put: put, pull: pull }"
			:move="containerDragMove"
			:tag="tag"
			:component-data="componentData"
			:data-binding-path="createItemBindingPath(index)"
			ghost-class="ghost"
			drag-class="drag"
			item-key="id"
			v-model="schema.children"
		>
			<template #item="scope">
				<div class="renderer-item-contents">
					<JsonRenderer v-model:schema="schema.children[scope.index]" />
				</div>
			</template>
		</draggable>
	</BindingContext>
</template>
