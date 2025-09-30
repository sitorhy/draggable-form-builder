<script setup lang="ts">
import { computed, ref } from 'vue';
import Editor from '../../libs/vue3-quill/editor.vue';
import { Mode } from 'vanilla-jsoneditor';

const props = defineProps({
	readOnly: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: '富文本'
	}
});

const modelValue = defineModel('value', {
	type: String,
	default: ''
});

const editorRef = ref();
const showModal = ref(false);
const content = ref<string>('');

const editorProps = computed(() => {
	return {
		mode: Mode.text,
		readOnly: props.readOnly
	};
});

const buttonText = computed(() => {
	return editorProps.value.readOnly ? '查看' : '编辑';
});

function open() {
	content.value = String(modelValue.value);
	showModal.value = true;
}

function onNegativeClick() {
	showModal.value = false;
}

function onPositiveClick() {
	modelValue.value = String(content.value);
	showModal.value = false;
}
</script>

<template>
	<n-button type="primary" @click="open">{{ buttonText }}</n-button>
	<n-modal
		style="width: 800px"
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
		<editor
			ref="editorRef"
			v-model:value="content"
			:options="{
				placeholder: '输入文本',
				modules: {}
			}"
			:disabled="readOnly"
		/>

		<template #action>
			<n-space>
				<n-button type="primary" @click="onPositiveClick">确定</n-button>
				<n-button @click="onNegativeClick">取消</n-button>
			</n-space>
		</template>
	</n-modal>
</template>
