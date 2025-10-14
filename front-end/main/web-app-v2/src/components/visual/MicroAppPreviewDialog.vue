<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui';
import useProjectStore from '../../store/project.ts';
import microApp from '@micro-zoe/micro-app';
import { computed } from 'vue';
import { useOutputEnginesInfo } from '../put/common/output.ts';

const props = defineProps({
	engine: {
		type: String,
		default: ''
	}
});

const message = useMessage();
const { engineOptions } = useOutputEnginesInfo();
const projectStore = useProjectStore();

const engineInfo = computed(() => {
	const engine = engineOptions.value.find((e) => e.value === props.engine);
	if (engine) {
		return engine;
	}
	return {
		name: '',
		url: ''
	};
});

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
	const project = await projectStore.packageProject({
		pageIds: [projectStore.currentPage]
	});
	const event = {
		type: 'loadProject',
		payload: project
	};
	microApp.setData(props.engine, event);
}
</script>

<template>
	<n-modal
		v-model:show="showModal"
		preset="card"
		:display-directive="'if'"
		:style="{ width: '60%', minWidth: '1000px' }"
		title="预览"
		:bordered="false"
	>
		<micro-app
			v-if="engineInfo.url"
			@error="onError"
			@mounted="onMounted"
			:name="engineInfo.name"
			:url="engineInfo.url"
		></micro-app>
		<n-empty v-else description="未知渲染引擎" />
		<template #footer>
			<n-button-group>
				<n-button @click="onPositiveClick" type="primary">确定</n-button>
			</n-button-group>
		</template>
	</n-modal>
</template>
