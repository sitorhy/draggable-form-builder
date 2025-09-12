<script setup lang="ts">
import { useSchemaActions } from '../../store/schema.ts';
import { computed } from 'vue';
import { useEmphasizeStore } from '../../store/emphasize.ts';
import { Settings24Regular } from '@vicons/fluent';
import { useComponentsStore } from '../../store/component.ts';
import PropertiesForm from '../put/data/PropertiesForm.vue';
import { generateBindingSchema } from './binding-schema';

const componentsStore = useComponentsStore();
const emphasizeStore = useEmphasizeStore();

const { findNodeById } = useSchemaActions();

const watchingSchemaId = computed(function () {
	return emphasizeStore.schemaId;
});

const watchingSchema = computed(function () {
	if (!watchingSchemaId.value) {
		return null;
	}
	return findNodeById(watchingSchemaId.value);
});

const schemaTypeName = computed(function () {
	if (!watchingSchema.value) {
		return '';
	}
	return (
		componentsStore.getComponentNameByType(watchingSchema.value.type) ||
		watchingSchema.value.type
	);
});

const bindingSchema = computed(function () {
	return generateBindingSchema({
		type: String(watchingSchema.value?.type || '')
	});
});
</script>

<template>
	<div class="editor">
		<div v-if="watchingSchema">
			<n-thing>
				<template #avatar>
					<n-icon :size="24">
						<Settings24Regular />
					</n-icon>
				</template>
				<template #header>
					<div>
						<div>{{ schemaTypeName }}</div>
						<div class="schema-id">{{ watchingSchema.id }}</div>
					</div>
				</template>
				<PropertiesForm
					v-bind="bindingSchema.formProps"
					:key="watchingSchema.id"
					:schema="bindingSchema.schema"
					v-model:props="watchingSchema.props"
				></PropertiesForm>
			</n-thing>
		</div>
		<div v-else class="editor-empty">
			<n-empty description="组件属性">
				<template #icon>
					<n-icon>
						<Settings24Regular />
					</n-icon>
				</template>
				<template #extra></template>
			</n-empty>
		</div>
	</div>
</template>

<style scoped lang="scss">
.editor {
	height: 100%;

	.editor-empty {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.schema-id {
		font-size: 10px;
		font-weight: bold;
	}
}
</style>
