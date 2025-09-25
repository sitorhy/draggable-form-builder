<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import {
	parseUri,
	stringifyDataSourceSchema,
	useDataSourceConfig
} from './data-source/config.ts';
import PropertiesForm from '../put/data/PropertiesForm.vue';
import type {
	NormalizeDataSource,
	PropertyInjectionSchema
} from '../../types.ts';

const emit = defineEmits(['confirm']);

defineProps({
	readOnly: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: '统一数据源'
	},
	controls: {
		type: Boolean,
		default: true
	}
});

const formRef = ref();
const modelValue = defineModel<string | NormalizeDataSource>('value');
const modelValueText = defineModel<string | NormalizeDataSource>('uri');

const { dataSourceSchemaRef, formSchema, itemKeyGetter, reset } =
	useDataSourceConfig();

const showModal = ref(false);
const schemaText = computed(() => {
	if (modelValueText.value) {
		return modelValueText.value;
	}
	if (typeof modelValue.value === 'string') {
		return modelValue.value;
	}
	return stringifyDataSourceSchema(modelValue.value as NormalizeDataSource);
});

function parseSchemaObj(): NormalizeDataSource {
	if (typeof modelValue.value === 'string') {
		return structuredClone(parseUri(toRaw(modelValue.value)));
	} else {
		return structuredClone(toRaw(modelValue.value) as NormalizeDataSource);
	}
}

function open() {
	if (!modelValueText.value) {
		if (!modelValue.value) {
			reset();
		} else {
			dataSourceSchemaRef.value = parseSchemaObj();
		}
	} else {
		dataSourceSchemaRef.value = structuredClone(parseUri(modelValueText.value));
	}
	showModal.value = true;
}

function onNegativeClick() {
	showModal.value = false;
}

function onPositiveClick() {
	formRef.value
		.validate((errors: Error[]) => {
			if (!errors || !errors.length) {
				const next = structuredClone(toRaw(dataSourceSchemaRef.value));
				const uri = stringifyDataSourceSchema(dataSourceSchemaRef.value);

				modelValue.value = next;
				modelValueText.value = uri;
				emit('confirm', modelValue.value, uri);
				showModal.value = false;
			}
		})
		.catch(() => {});
	return false;
}

defineExpose({
	open: (schema: NormalizeDataSource | string) => {
		if (typeof schema === 'string') {
			if (schema) {
				dataSourceSchemaRef.value = structuredClone(parseUri(toRaw(schema)));
			} else {
				reset();
			}
		} else {
			if (schema) {
				dataSourceSchemaRef.value = structuredClone(toRaw(schema));
			} else {
				reset();
			}
		}
		showModal.value = true;
	},
	close: onNegativeClick
});
</script>

<template>
	<n-input-group v-if="controls">
		<n-input placeholder="" :value="schemaText" readonly :disabled="readOnly" />
		<n-button type="primary" v-if="!readOnly" @click="open">设置</n-button>
	</n-input-group>
	<n-modal
		style="width: 600px"
		v-model:show="showModal"
		:mask-closable="false"
		:title="title"
		:show-icon="false"
		preset="dialog"
		positive-text="确定"
		negative-text="取消"
		@positive-click="onPositiveClick"
		@negative-click="onNegativeClick"
	>
		<PropertiesForm
			ref="formRef"
			v-model:props="dataSourceSchemaRef"
			:cols="2"
			:item-key="itemKeyGetter"
			:schema="formSchema as PropertyInjectionSchema[]"
		/>
	</n-modal>
</template>
