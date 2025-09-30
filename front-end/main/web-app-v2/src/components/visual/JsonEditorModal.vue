<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import JsonEditorVue from 'json-editor-vue';
import { v4 as uuid } from 'uuid';
import { Mode } from 'vanilla-jsoneditor';
import { useMessage } from 'naive-ui';

const message = useMessage();

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
const loopJson = ref<string | null>(null);

const editorProps = computed(() => {
	return {
		mode: Mode.text,
		readOnly: props.readOnly
	};
});

const buttonText = computed(() => {
	return editorProps.value.readOnly ? '查看' : '编辑';
});

function writeTemplateArr() {
	loopJson.value = JSON.stringify(
		[
			{
				id: uuid()
			},
			{
				id: uuid()
			}
		],
		null,
		2
	);
}

function open() {
	loopJson.value = modelValue.value
		? JSON.stringify(modelValue.value, null, 2)
		: null;
	showModal.value = true;
}

function onNegativeClick() {
	showModal.value = false;
}

function onPositiveClick() {
	const errors = editorRef.value.jsonEditor.validate();
	if (!errors) {
		nextTick(() => {
			if (loopJson.value) {
				const arr = JSON.parse(loopJson.value);
				if (!Array.isArray(arr)) {
					message.warning('对象为非数组类别');
					return;
				}
				modelValue.value = arr;
			} else {
				modelValue.value = null;
			}
			loopJson.value = null;
			showModal.value = false;
		});
	}
	return false;
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
		<JsonEditorVue ref="editorRef" v-model="loopJson" v-bind="editorProps" />

		<template #action>
			<n-space>
				<n-button type="info" @click="writeTemplateArr">填充模板数组</n-button>
				<n-button type="primary" @click="onPositiveClick">确定</n-button>
				<n-button @click="onNegativeClick">取消</n-button>
			</n-space>
		</template>
	</n-modal>
</template>
