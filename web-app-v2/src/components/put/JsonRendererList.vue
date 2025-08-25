<script setup lang="ts">
import { computed } from 'vue';
import BindingContext from './data/BindingContext.vue';
import JsonRenderer from './JsonRenderer.vue';
import draggable from 'vuedraggable';
import type { RendererItemDefinition } from '../../types.ts';
import { useContainerMove } from './common/moveable.ts';
import { useBindingPath } from './common/binding-path.ts';

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
	}
});

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const props = computed(function () {
	return schema.value.props
		? schema.value.props
		: {
				dataSource: '', // 绑定数据源id，数据源返回数组
				loop: [] // 绑定静态数据，优先级高于数据源
			};
});

const loop = computed<any[]>(function () {
	return props.value.loop;
});

const bindingPathOptions = computed(() => {
	return {
		bracket: false,
		path: schema.value.id,
		parseNumber: false
	};
});

const { getCurrentPathConfig, collectParentBindingPathConfig, joinPathConfig } =
	useBindingPath(bindingPathOptions);

const parentBindingPathConfig = computed(() => {
	return collectParentBindingPathConfig();
});

function createItemBindingPath(index: number) {
	return joinPathConfig(
		[
			getCurrentPathConfig({
				bracket: true,
				path: String(index),
				parseNumber: true
			})
		].concat(parentBindingPathConfig.value)
	);
}

const { containerDragMove } = useContainerMove();
</script>

<template>
	<div class="renderer-drop draggable-emphasized" v-if="!loop || !loop.length">
		<!--占位-->
	</div>
	<BindingContext
		v-else
		v-for="(item, index) in loop"
		:key="createItemBindingPath(index)"
		:bracket="true"
		:parse-number="true"
		:component-context="item"
		:path="`${index}`"
	>
		<draggable
			v-if="schema.children"
			:class="['renderer-drop', schema.type, 'draggable-emphasized']"
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
				<div>
					<JsonRenderer v-model:schema="schema.children[scope.index]" />
				</div>
			</template>
		</draggable>
	</BindingContext>
</template>
