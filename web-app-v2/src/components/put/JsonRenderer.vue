<script setup lang="ts">
import draggable from 'vuedraggable';
import JsonRendererItem from './JsonRendererItem.vue';
import type { RendererItemDefinition } from '../../types.ts';
import { type ComputedRef, inject } from 'vue';
import JsonRendererItemContainer from './JsonRendererItemContainer.vue';

defineOptions({
	name: 'JsonRenderer'
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});
</script>

<template>
	<!--占位元素 负责具体渲染渲染-->
	<JsonRendererItem v-model:schema="schema">
		<!-- 拖入区域 占位元素不提供插槽即不可拖入 -->
		<draggable
			v-if="schema.children"
			:class="['renderer-drop', schema.type]"
			:group="{ name: 'renderer', put: true, pull: true }"
			:data-binding-path="bindingPath"
			ghost-class="ghost"
			drag-class="drag"
			item-key="id"
			v-model="schema.children"
		>
			<template #item="scope">
				<JsonRendererItemContainer
					v-model:schema="schema.children[scope.index]"
					:data-binding-path="bindingPath"
				>
					<div class="renderer-item-container" :data-binding-path="bindingPath">
						<JsonRenderer v-model:schema="schema.children[scope.index]" />
					</div>
				</JsonRendererItemContainer>
			</template>
		</draggable>
	</JsonRendererItem>
</template>
