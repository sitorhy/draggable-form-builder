<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import JsonEditorVue from 'json-editor-vue';
import { Mode } from 'vanilla-jsoneditor';

const props = defineProps({
	readOnly: {
		type: Boolean,
		default: false
	},
	title: {
		type: String,
		default: 'JSON Object'
	}
});

const modelValue = defineModel('value', {
	type: Object,
	default: () => ({})
});

const editorRef = ref();
const showModal = ref(false);
const loopJson = ref(null);

const editorProps = computed(() => {
	return {
		mode: Mode.text,
		readOnly: !props.readOnly
	};
});

const buttonText = computed(() => {
	return editorProps.value.readOnly ? '查看' : '编辑';
});

function open() {
	loopJson.value = JSON.stringify(modelValue.value, null, 2);
	showModal.value = true;
}

function onNegativeClick() {
	showModal.value = false;
}

function onPositiveClick() {
	const errors = editorRef.value.jsonEditor.validate();
	if (!errors) {
		nextTick(() => {
			modelValue.value = JSON.parse(loopJson.value);
			loopJson.value = null;
		});
	}
	return !errors;
}
</script>

<template>
	<n-button @click="open">{{ buttonText }}</n-button>
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
		<div class="content">
			<JsonEditorVue ref="editorRef" v-model="loopJson" v-bind="editorProps" />
		</div>
	</n-modal>
</template>
