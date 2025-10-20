<script setup lang="ts">
import useProjectStore from '../../store/project.ts';
import { useBindingStore } from '../../store/binding.ts';
import { useSchemaStore } from '../../store/schema.ts';
import { computed, ref, watch } from 'vue';
import { Mode } from 'vanilla-jsoneditor';
import JsonEditorVue from 'json-editor-vue';
import FunctionDialog from './FunctionDialog.vue';
import MicroAppPreviewDialog from './MicroAppPreviewDialog.vue';
import { useOutputEnginesInfo } from '../put/common/output.ts';
import { DocumentChevronDouble24Regular } from '@vicons/fluent';

import FunctionCodeSelect from './FunctionCodeSelect.vue';
import ProjectDataSourcesEditor from './ProjectDataSourcesEditor.vue';

const projectStore = useProjectStore();
const project = computed(() => projectStore.project);
const currentPage = computed(() => projectStore.currentPage);
const pages = computed(() => project.value?.pages || []);

const { engineOptions } = useOutputEnginesInfo();

const schemaStore = useSchemaStore();
const bindingStore = useBindingStore();
const schema = computed(() => schemaStore.schema);

const stateViewObject = computed(() => {
	return {
		state: bindingStore.state,
		staticContext: bindingStore.staticContext
	};
});

const schemaDrawerShow = ref(false);
const bindingDrawerShow = ref(false);
const editorProps = computed(() => {
	return {
		mode: Mode.text,
		readOnly: true
	};
});
const funModelShow = ref(false);

function reset() {
	modelValue.value = { title: '', page: '' };
}

const modelValue = ref({
	title: '',
	page: ''
});

watch(
	[project, currentPage],
	([project, currentPage]) => {
		if (project) {
			modelValue.value = {
				...modelValue.value,
				title: project.title,
				page: currentPage
			};
		} else {
			reset();
		}
	},
	{
		immediate: true
	}
);

function onPageSwitch(pageId: string) {
	projectStore.switchPage(pageId);
}

function openFunctionDlg() {
	funModelShow.value = true;
}

function createPage() {
	const id = projectStore.createNewPage({
		localFlag: true
	});
	projectStore.switchPage(id);
}

const previewDlgShow = ref(false);
function previewCurrentPage() {
	projectStore.switchPage(projectStore.currentPage);
	previewDlgShow.value = true;
}

async function exportProjectJson() {
	const json = await projectStore.packageProject();
	const jsonString = JSON.stringify(json, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'project.json';
	document.body.appendChild(a);
	a.click();

	// (释放内存)
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
</script>

<template>
	<n-card>
		<template v-if="projectStore.$state.project.id">
			<n-form :model="modelValue" label-placement="top">
				<n-form-item path="title" label="项目">
					<n-input-group>
						<n-input v-model:value="modelValue.title" readonly />
						<n-button @click="exportProjectJson" title="导出">
							<template #icon>
								<n-icon color="primary">
									<DocumentChevronDouble24Regular />
								</n-icon>
							</template>
						</n-button>
					</n-input-group>
				</n-form-item>

				<n-form-item path="page" label="页面">
					<n-space vertical align="stretch">
						<n-radio-group
							v-model:value="modelValue.page"
							name="page"
							@update:value="onPageSwitch"
						>
							<n-space vertical align="stretch">
								<n-radio
									style="width: 100%"
									v-for="page in pages"
									:key="page.id"
									:value="page.id"
								>
									{{ page.title }}
								</n-radio>
							</n-space>
						</n-radio-group>

						<n-button size="small" type="primary" @click="createPage">
							<span>新页面</span>
						</n-button>
					</n-space>
				</n-form-item>

				<n-form-item path="$schema" label="模式">
					<n-button
						style="width: 100%"
						size="small"
						type="primary"
						@click="schemaDrawerShow = true"
					>
						<span>查看</span>
					</n-button>
				</n-form-item>

				<n-form-item path="$schema" label="状态">
					<n-button
						size="small"
						style="width: 100%"
						title="查看"
						type="primary"
						@click="bindingDrawerShow = true"
					>
						<span>查看</span>
					</n-button>
				</n-form-item>

				<n-form-item path="$schema" label="函数集">
					<n-button
						style="width: 100%"
						size="small"
						type="primary"
						@click="openFunctionDlg"
					>
						<span>查看</span>
					</n-button>
				</n-form-item>

				<n-form-item path="$initDataState" label="状态初始化">
					<FunctionCodeSelect
						size="small"
						:multiple="false"
						v-model:value="projectStore.project.initStateModuleName"
					/>
				</n-form-item>

				<n-form-item path="engine" label="输出引擎">
					<n-space vertical align="stretch" style="width: 100%">
						<n-select
							v-model:value="projectStore.project.engine"
							:options="engineOptions"
						></n-select>
						<n-button
							style="width: 100%"
							:disabled="!projectStore.project.engine"
							size="small"
							type="primary"
							@click="previewCurrentPage"
						>
							<span>预览</span>
						</n-button>
					</n-space>
				</n-form-item>

				<n-form-item path="$preloadDataSources" label="数据预加载">
					<ProjectDataSourcesEditor
						v-model:value="projectStore.project.preloadDataSources"
					/>
				</n-form-item>
			</n-form>
		</template>
		<n-empty v-else description="无演示项目" />
	</n-card>

	<n-drawer
		v-model:show="schemaDrawerShow"
		:display-directive="'show'"
		:width="1000"
		placement="right"
	>
		<n-drawer-content closable title="模式">
			<div>
				<JsonEditorVue :modelValue="schema" v-bind="editorProps" />
			</div>
		</n-drawer-content>
	</n-drawer>

	<n-drawer
		v-model:show="bindingDrawerShow"
		:display-directive="'show'"
		:width="1000"
		placement="right"
	>
		<n-drawer-content closable title="状态">
			<JsonEditorVue :modelValue="stateViewObject" v-bind="editorProps" />
		</n-drawer-content>
	</n-drawer>

	<FunctionDialog v-model="funModelShow" />
	<MicroAppPreviewDialog
		:engine="projectStore.project.engine"
		v-model:model-value="previewDlgShow"
	/>
</template>

<style scoped lang="scss"></style>
