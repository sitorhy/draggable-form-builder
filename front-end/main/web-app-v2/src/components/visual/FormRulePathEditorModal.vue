<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['confirm']);

const formRef = ref();

const showModal = defineModel('show', {
	type: Boolean,
	default: false
});

const modelValue = ref({
	path: ''
});

watch(showModal, (value) => {
	if (!value) {
		modelValue.value = {
			path: ''
		};
	}
});

function onConfirm() {
	formRef.value.validate().then((valid: boolean) => {
		if (valid) {
			emit('confirm', modelValue.value);
			showModal.value = false;
		}
	});
}

function onCancel() {
	showModal.value = false;
}
</script>

<template>
	<n-modal
		v-model:show="showModal"
		title="对象路径"
		preset="card"
		draggable
		:style="{ width: '400px' }"
	>
		<n-form
			ref="formRef"
			:model="modelValue"
			:rules="{ path: [{ required: true, message: '路径不能为空' }] }"
		>
			<n-form-item path="path" label="路径">
				<n-input v-model:value="modelValue.path" />
			</n-form-item>
		</n-form>
		<template #footer>
			<n-space>
				<n-button @click="onConfirm" type="primary">确定</n-button>
				<n-button @click="onCancel">取消</n-button>
			</n-space>
		</template>
	</n-modal>
</template>

<style scoped lang="scss"></style>
