<script setup lang="ts">
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../types.ts';
import { computed, type PropType, ref } from 'vue';
import DataSourceSchema from './DataSourceSchema.vue';
import { stringifyDataSourceSchema } from './data-source/config.ts';
import SchemaBindingEditorAddDlg from './SchemaBindingEditorAddDlg.vue';

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	},
	protectedFields: {
		type: Array as PropType<string[]>,
		default: () => []
	}
});

const addDlgRef = ref();

const binding = computed(() => {
	return props.schema.binding || {};
});

const bindingList = computed(() => {
	return Object.keys(binding.value).map((field) => ({
		field,
		dataSourceSchema: binding.value[field]
	}));
});

const dlgProtectedFields = computed(() => {
	return props.protectedFields.concat(bindingList.value.map((i) => i.field));
});

function updateDataSourceSchema(
	field: string,
	schema: string | NormalizeDataSource | undefined
): void {
	if (typeof schema === 'string') {
		binding.value[field] = schema;
	} else {
		binding.value[field] = stringifyDataSourceSchema(
			schema as NormalizeDataSource
		);
	}
}

function onAddBinding() {
	addDlgRef.value.open();
}

function onDlgConfirm(data: { uri: string; field: string }) {
	binding.value[data.field] = data.uri;
}
</script>

<template>
	<div>
		<n-form :label-placement="'top'">
			<n-form-item v-for="i in bindingList" :label="i.field" :key="i.field">
				<DataSourceSchema
					:value="i.dataSourceSchema"
					:readOnly="protectedFields.includes(i.field)"
					@update:value="(value) => updateDataSourceSchema(i.field, value)"
				/>
			</n-form-item>
		</n-form>
		<n-button @click="onAddBinding" style="width: 100%" type="primary">
			<span>添加绑定</span>
		</n-button>
		<SchemaBindingEditorAddDlg
			:protected-fields="dlgProtectedFields"
			@confirm="onDlgConfirm"
			ref="addDlgRef"
		/>
	</div>
</template>
