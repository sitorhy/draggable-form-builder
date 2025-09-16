<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { useDataSourceConfig } from './data-source/config.ts';
import PropertiesForm from '../put/data/PropertiesForm.vue';

defineProps({
	readOnly: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: '统一数据源'
	}
});

const formRef = ref();
const modelValue = defineModel('value');
const {
	dataSourceSchemaRef,
	formSchema,
	itemKeyGetter,
	stringifyDataSourceSchema,
	reset
} = useDataSourceConfig();

const showModal = ref(false);

function open() {
	if (!modelValue.value) {
		reset();
	} else {
		dataSourceSchemaRef.value = structuredClone(toRaw(modelValue.value));
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
				modelValue.value = structuredClone(toRaw(dataSourceSchemaRef.value));
				showModal.value = false;
			}
		})
		.catch(() => {});
	return false;
}
</script>

<template>
	<n-input-group>
		<n-input
			placeholder=""
			:value="stringifyDataSourceSchema(modelValue)"
			readonly
			:disabled="readOnly"
		/>
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
			:item-key="itemKeyGetter"
			:schema="formSchema"
		/>
	</n-modal>
</template>
