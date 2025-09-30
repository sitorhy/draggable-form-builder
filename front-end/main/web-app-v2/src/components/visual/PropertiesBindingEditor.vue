<script setup lang="ts">
import { useSchemaActions } from '../../store/schema.ts';
import { computed, ref } from 'vue';
import { useEmphasizeStore } from '../../store/emphasize.ts';
import { Settings24Regular } from '@vicons/fluent';
import { useComponentsStore } from '../../store/component.ts';
import { generateBindingSchema } from './binding-schema';
import { useFormItemSchemaFilter } from './binding-schema/filter';
import PropertiesForm from '../put/data/PropertiesForm.vue';
import type {
	NormalizeDataSource,
	PropertyInjectionSchema
} from '../../types.ts';
import DataSourceSchema from './DataSourceSchema.vue';
import { parseUri, stringifyDataSourceSchema } from './data-source/config.ts';

const componentsStore = useComponentsStore();
const emphasizeStore = useEmphasizeStore();

const dataSourceSchemaDlgRef = ref();

const { findNodeById } = useSchemaActions();
const { filterFormItemSchema } = useFormItemSchemaFilter();

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
	let itemProps = filterFormItemSchema(watchingSchema);
	return generateBindingSchema({
		schema: watchingSchema.value,
		itemProps
	});
});

const propBindingSchemaSession = ref({
	prop: ''
});

function onPropLink(item: PropertyInjectionSchema) {
	propBindingSchemaSession.value.prop = item.prop;
	const uri = watchingSchema.value?.binding?.[item.prop] || '';
	dataSourceSchemaDlgRef.value.open(uri ? parseUri(uri) : null);
}

function onPropUnLink(item: PropertyInjectionSchema) {
	if (watchingSchema.value && watchingSchema.value.binding) {
		delete watchingSchema.value.binding[item.prop];
	}
}

function createPropBinding(dataSourceSchema: NormalizeDataSource) {
	if (watchingSchema.value) {
		watchingSchema.value.binding = {
			...watchingSchema.value.binding,
			[propBindingSchemaSession.value.prop]:
				stringifyDataSourceSchema(dataSourceSchema)
		};
	}
	dataSourceSchemaDlgRef.value.close();
}
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
						<n-tooltip trigger="hover" placement="right">
							<template #trigger>
								<div>{{ schemaTypeName }}</div>
							</template>
							<div class="list">
								<div class="list-item">
									<div class="list-header">schemaId</div>
									<div class="list-body">
										{{ watchingSchema.id }}
									</div>
								</div>
							</div>
						</n-tooltip>
					</div>
				</template>

				<n-space :vertical="true">
					<n-card
						:key="watchingSchema.id + '_' + section.id"
						v-for="section in bindingSchema.schemas.sections"
						:title="section.title"
						size="small"
					>
						<PropertiesForm
							v-bind="bindingSchema.formProps"
							:schema="section.schema"
							:form-id="watchingSchema.id"
							@link:prop="onPropLink"
							@unlink:prop="onPropUnLink"
							v-model:binding="watchingSchema.binding"
							v-model:props="watchingSchema.props"
						></PropertiesForm>
					</n-card>
				</n-space>
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

	<DataSourceSchema
		:controls="false"
		ref="dataSourceSchemaDlgRef"
		@confirm="createPropBinding"
	/>
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
}

.list {
	font-size: 10px;
	font-weight: bold;

	.list-item {
		display: flex;

		.list-header {
			width: 8em;
		}
	}
}
</style>
