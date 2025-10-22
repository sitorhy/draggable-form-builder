<script setup lang="ts">
import { NButton, useMessage } from 'naive-ui';
import { computed, nextTick, onUnmounted, ref, watch, watchEffect } from 'vue';
import { BuildService } from '../../api';
import useProjectStore from '../../store/project.ts';

defineProps({});

const projectStore = useProjectStore();

const loading = ref(false);

const message = useMessage();

const historyTimer = ref(0);

const logRef = ref();
const loadingRef = ref(false);
const logInstRef = ref();

const logTimer = ref(0);
const buildTimer = ref(0);

const currentBuildInfo = ref({
	jobName: '',
	buildNumber: ''
});

const JOB_BUILD_ENABLE = import.meta.env.VITE_JOB_BUILD_ENABLE;

const jobBuildEnabled = computed(() => {
	return Number(JOB_BUILD_ENABLE) === 1;
});

async function updateLog() {
	try {
		const res = await new BuildService().getConsoleText(
			currentBuildInfo.value.jobName,
			currentBuildInfo.value.buildNumber
		);
		logRef.value = res.data.message;
		return true;
	} catch (e) {
		console.error(e);
		message.error(e instanceof Error ? e.message : JSON.stringify(e));
	}
	return false;
}

function stopUpdateLog() {
	clearTimeout(logTimer.value);
	logTimer.value = 0;
}

async function startUpdateLog() {
	if (!logTimer.value) {
		logTimer.value = setTimeout(async () => {
			logTimer.value = 0;
			const success = await updateLog();
			if (!success) {
				stopUpdateLog();
			} else {
				(() => {
					startUpdateLog();
				})();
			}
		}, 2000);
	}
}

function startUpdateHistory() {
	if (!historyTimer.value) {
		historyTimer.value = setInterval(async () => {
			await reloadHistory();
		}, 2000);
	}
}

function stopUpdateHistory() {
	clearInterval(historyTimer.value);
	historyTimer.value = 0;
}

const showModal = defineModel('modelValue', {
	type: Boolean,
	default: false
});
const logModalShow = ref(false);

async function showLogModal(jobName: string, buildNumber: string) {
	currentBuildInfo.value.buildNumber = buildNumber;
	currentBuildInfo.value.jobName = jobName;

	logRef.value = '';
	logModalShow.value = true;
	await nextTick(() => {
		updateLog();
	});
}

function onPositiveClick() {
	showModal.value = false;
}

const listData = ref<
	{
		jobName: string;
		buildNumber: string;
		stageStatus: string;
		stageName: string;
	}[]
>([]);

async function reloadHistory() {
	try {
		const res = await new BuildService().collectJobBuildList(
			projectStore.$state.project.name
		);
		if (listData.value.length !== res.data.data.length) {
			setTimeout(() => {
				loading.value = false;
				clearTimeout(buildTimer.value);
				buildTimer.value = 0;
			});
		}
		listData.value = res.data.data;
	} catch (e: unknown) {
		console.error(e);
		message.error(e instanceof Error ? e.message : JSON.stringify(e));
		listData.value = [];
	}
}

watch(
	showModal,
	async (value) => {
		if (value) {
			await reloadHistory();
			startUpdateHistory();
		} else {
			stopUpdateHistory();
		}
	},
	{
		immediate: true
	}
);

watch(logModalShow, async (value) => {
	if (value) {
		await startUpdateLog();
	} else {
		stopUpdateLog();
		await reloadHistory();
	}
});

watchEffect(() => {
	if (logRef.value) {
		nextTick(() => {
			logInstRef.value?.scrollTo({ position: 'bottom', silent: true });
		});
	}
});

async function onNewJobClick() {
	if (!jobBuildEnabled.value) {
		return;
	}
	try {
		const service = new BuildService();
		const projectName = projectStore.$state.project.name;
		const jobs = await service.findJobs(projectName);
		if (jobs.data.length <= 0) {
			const result = await service.createJob(projectName);
			if (!result.data.success) {
				message.error(result.data.message);
				return;
			}
		}

		const json = await projectStore.packageProject();
		const res = await service.buildJob(
			projectName,
			JSON.stringify(json),
			projectStore.project.engine || ''
		);
		if (!res.data.success) {
			message.error(res.data.message);
		}

		await reloadHistory();
		loading.value = true;
		buildTimer.value = setTimeout(() => {
			clearTimeout(buildTimer.value);
			buildTimer.value = 0;
			loading.value = false;
		}, 20000);
	} catch (e: unknown) {
		console.error(e);
		message.error(e instanceof Error ? e.message : JSON.stringify(e));
	}
}

function toLink() {
	const tryUrl = `${location.protocol}//${location.hostname}:8000/${projectStore.$state.project.name}/index.html`;
	window.open(tryUrl, '_blank');
}

onUnmounted(() => {
	stopUpdateHistory();
	stopUpdateLog();
});
</script>

<template>
	<n-modal
		v-model:show="showModal"
		preset="card"
		:style="{ width: '800px' }"
		title="构建测试"
		:bordered="false"
	>
		<n-list>
			<template #header>
				<n-space>
					<n-button
						:disabled="jobBuildEnabled"
						:loading="loading"
						:title="jobBuildEnabled ? '' : '资源不足不开放'"
						type="primary"
						@click="onNewJobClick"
						>构建新任务</n-button
					>
					<n-button :loading="loading" type="info" @click="toLink"
						>跳转</n-button
					>
				</n-space>
			</template>
			<template #footer></template>
			<n-scrollbar style="max-height: 400px">
				<n-list-item
					v-for="item in listData"
					:key="`${item.jobName}#${item.buildNumber}`"
				>
					<template #prefix>
						<n-button
							type="info"
							:text="true"
							@click="() => showLogModal(item.jobName, item.buildNumber)"
							>{{ item.jobName }}#{{ item.buildNumber }}</n-button
						>
					</template>
					<n-space>
						<span>
							<span></span>
							<n-tag>Stage : {{ item.stageName }}</n-tag>
						</span>
						<span>
							<n-tag
								:type="item.stageStatus === 'SUCCESS' ? 'success' : 'default'"
								>StageStatus : {{ item.stageStatus }}</n-tag
							>
						</span>
					</n-space>
				</n-list-item>
				<n-empty v-if="!listData.length"></n-empty>
			</n-scrollbar>
		</n-list>
		<template #footer>
			<n-button-group>
				<n-button @click="onPositiveClick" type="primary">关闭</n-button>
			</n-button-group>
		</template>
	</n-modal>

	<n-modal
		v-model:show="logModalShow"
		preset="card"
		:style="{ width: '1000px' }"
		title="日志"
		:mask-closable="true"
		:bordered="false"
	>
		<n-log
			ref="logInstRef"
			:log="logRef"
			:loading="loadingRef"
			:rows="30"
			language="accesslog"
			trim
		></n-log>
	</n-modal>
</template>
