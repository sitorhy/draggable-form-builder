<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui';
import { useProjectStore } from '../../store/project.ts';
import microApp from '@micro-zoe/micro-app';

defineProps({});

const message = useMessage();
const projectStore = useProjectStore();

const showModal = defineModel('modelValue', {
	type: Boolean,
	default: false
});

function onPositiveClick() {
	showModal.value = false;
}

function onError() {
	message.error('子应用未启动');
}

async function onMounted() {
	const project = await projectStore.packageProject();
	const event = {
		type: 'loadProject',
		payload: project
	};
	microApp.setData('pager-engine-app', event);
}
</script>

<template>
	<n-modal
		v-model:show="showModal"
		preset="card"
		:display-directive="'if'"
		:style="{ width: '80%', minWidth: '1000px' }"
		title="预览"
		:bordered="false"
	>
		<micro-app
			@error="onError"
			@mounted="onMounted"
			name="pager-engine-app"
			url="http://localhost:5174/"
		></micro-app>
		<template #footer>
			<n-button-group>
				<n-button @click="onPositiveClick" type="primary">确定</n-button>
			</n-button-group>
		</template>
	</n-modal>
</template>
