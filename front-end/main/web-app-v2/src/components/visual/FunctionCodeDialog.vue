<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import { NButton, NInput, useMessage } from 'naive-ui';
import { useFunctionStore } from '../../store/function';
import type { FunctionCode } from '../../types';
import PropertiesForm from '../put/data/PropertiesForm.vue';
import MonacoEditor from '../../libs/monaco-editor.vue';

defineProps({});

const emit = defineEmits(['success']);

const functionStore = useFunctionStore();
const message = useMessage();

const formRef = ref();

const showModal = defineModel('modelValue', {
	type: Boolean,
	default: false
});

const formData = defineModel('formData', {
	type: Object as PropType<Partial<FunctionCode>>,
	default: () => ({
		code: ''
	})
});

const schema = computed(() => {
	return [
		{
			type: NInput,
			label: '名称',
			prop: 'name',
			config: {
				placeholder: ''
			},
			rules: [
				{
					required: true,
					message: '函数名称'
				}
			]
		},
		{
			prop: 'description',
			label: '描述',
			type: NInput,
			config: {
				placeholder: '使用说明'
			},
			rules: [
				{
					required: false
				}
			]
		},
		{
			span: 4,
			label: '脚本',
			prop: 'code',
			type: 'slotScope'
		}
	];
});

function onPositiveClick() {
	if (formRef.value) {
		formRef.value
			.validate(async (errs?: Error[]) => {
				if (!errs) {
					try {
						if (formData.value.id) {
							await functionStore.updateFunctionCode(formData.value);
							message.success('函数已更新');
						} else {
							await functionStore.createFunctionCode(formData.value);
							message.success('函数已创建');
						}
						emit('success');
					} catch (e) {
						message.error((e as Error).message);
						return;
					}
					showModal.value = false;
				}
			})
			.catch(() => {});
	}
}

function onNegativeClick() {
	showModal.value = false;
}
</script>

<template>
	<n-modal
		v-model:show="showModal"
		preset="card"
		:style="{ width: '68%' }"
		title="函数定义"
		:bordered="false"
	>
		<PropertiesForm
			ref="formRef"
			:cols="2"
			:schema="schema"
			v-model:props="formData"
			label-width="6em"
		>
			<template #code>
				<MonacoEditor
					theme="vs-dark"
					language="javascript"
					width="100%"
					:height="300"
					:diffEditor="false"
					v-model:value="formData.code"
				></MonacoEditor>
			</template>
		</PropertiesForm>
		<template #footer>
			<n-button-group>
				<n-button @click="onPositiveClick" type="primary">确定</n-button>
				<n-button @click="onNegativeClick">取消</n-button>
			</n-button-group>
		</template>
	</n-modal>
</template>

<style scoped lang="scss">
.json-editor {
	width: 100%;
}
</style>
