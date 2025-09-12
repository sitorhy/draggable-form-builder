<script setup lang="ts">
import { computed, inject } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const id = computed(function () {
	return schema.value.id;
});

const bindingProps = inject<Record<string, any> | null>('bindingProps', null);

defineExpose({
	id: id.value
});
</script>

<template>
	<n-form-item
		v-if="schema.props && schema.children"
		v-bind="{ ...schema.props, ...bindingProps }"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-form-item>
	<n-empty v-else description="FormItem">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
