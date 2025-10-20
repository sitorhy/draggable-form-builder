<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMessage } from 'naive-ui';
import FormRulePathEditorModal from './FormRulePathEditorModal.vue';
import DataSourceSchema from './DataSourceSchema.vue';
import { Dismiss24Filled } from '@vicons/fluent';

const message = useMessage();

const dataSourcesSet = defineModel<Record<string, string>>('value', {});

const pathModelShow = ref(false);

function onAddPath() {
	pathModelShow.value = true;
}

function onConfirm(value: { path: string }) {
	const path = value.path;
	if (dataSourcesSet.value && dataSourcesSet.value[path]) {
		message.warning('路径已存在');
		return;
	}
	dataSourcesSet.value = {
		...dataSourcesSet.value,
		[path]: ''
	};
}

const pathList = computed(() => {
	if (!dataSourcesSet.value) {
		return [];
	}
	return Object.keys(dataSourcesSet.value);
});

function onRemoveRule(path: string) {
	if (dataSourcesSet.value) {
		delete dataSourcesSet.value[path];
	}
}
</script>

<template>
	<div class="full">
		<n-form class="full" :model="dataSourcesSet" v-if="dataSourcesSet">
			<n-form-item
				class="full"
				v-for="path in pathList"
				:key="path"
				:path="path"
				:label="path"
			>
				<n-space>
					<n-button
						@click="onRemoveRule(path)"
						:size="'small'"
						type="error"
						strong
						secondary
						circle
					>
						<template #icon>
							<n-icon><Dismiss24Filled /></n-icon>
						</template>
					</n-button>
					<DataSourceSchema size="small" v-model:uri="dataSourcesSet[path]" />
				</n-space>
			</n-form-item>
		</n-form>
		<n-button size="small" type="primary" @click="onAddPath">
			<span>添加对象路经</span>
		</n-button>
	</div>

	<FormRulePathEditorModal @confirm="onConfirm" v-model:show="pathModelShow" />
</template>

<style scoped lang="scss">
.full {
	width: 100%;
}
</style>
