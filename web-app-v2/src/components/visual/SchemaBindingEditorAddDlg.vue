<script setup lang="ts">
import { computed, ref } from 'vue';
import type { NormalizeDataSource } from '../../types.ts';
import { stringifyDataSourceSchema } from './data-source/config.ts';
import DataSourceSchema from './DataSourceSchema.vue';
import type { FormItemRule } from 'naive-ui';

const emit = defineEmits(['confirm']);

const props = defineProps({
	title: {
		type: String,
		default: '添加绑定'
	},
	protectedFields: {
		type: Array,
		default: () => []
	}
});

const formRef = ref();
const modelValue = ref({
	field: '',
	uri: ''
});
const showModal = ref(false);

function open() {
	showModal.value = true;
}

function onNegativeClick() {
	showModal.value = false;
}

function onPositiveClick() {
	formRef.value
		.validate((errors: Error[]) => {
			if (!errors || !errors.length) {
				emit('confirm', {
					...modelValue.value
				});
				showModal.value = false;
			}
		})
		.catch(() => {});
	return false;
}

function updateDataSourceSchema(schema: NormalizeDataSource): void {
	modelValue.value.uri = stringifyDataSourceSchema(schema);
}

const rules = computed(() => {
	return {
		field: [
			{
				trigger: ['input', 'blur'],
				required: true,
				validator: (
					_: FormItemRule,
					value: string,
					callback: (e?: Error) => void
				) => {
					if ((value || '').trim() === '') {
						callback(new Error('输入字段名称'));
						return;
					}
					if (props.protectedFields.includes(value)) {
						callback(new Error('名称重复或被强制保留'));
						return;
					}
					callback();
				}
			}
		],
		uri: [
			{
				trigger: ['input', 'blur'],
				required: true,
				message: '配置数据源'
			}
		]
	};
});

defineExpose({
	open,
	close: onNegativeClick
});
</script>

<template>
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
		<n-form ref="formRef" :model="modelValue" :rules="rules">
			<n-form-item path="field" label="字段名称">
				<n-input v-model:value="modelValue.field" />
			</n-form-item>
			<n-form-item path="uri" label="数据源">
				<DataSourceSchema
					:value="modelValue.uri"
					@update:value="updateDataSourceSchema"
				/>
			</n-form-item>
		</n-form>
	</n-modal>
</template>
