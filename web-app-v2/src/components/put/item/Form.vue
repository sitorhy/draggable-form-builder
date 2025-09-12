<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { ErrorCircle20Regular } from '@vicons/fluent';
import type { RendererItemDefinition } from '../../../types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({ type: '', id: '', children: undefined })
});

const innerValue = ref({});

const id = computed(function () {
	return schema.value.id;
});

const bindingProps = inject<Record<string, any> | null>('bindingProps', null);

defineExpose({
	id: id.value
});
</script>

<template>
	<n-form
		v-if="schema.props && schema.children"
		v-bind="{ ...schema.props, ...bindingProps }"
		v-model:value="innerValue"
	>
		<JsonRenderer
			v-for="(containerSchema, index) in schema.children"
			:key="containerSchema.id"
			v-model:schema="schema.children[index]"
		/>
	</n-form>
	<n-empty v-else description="Form">
		<template #icon>
			<n-icon>
				<ErrorCircle20Regular />
			</n-icon>
		</template>
	</n-empty>
</template>
