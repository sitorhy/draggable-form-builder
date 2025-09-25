<script setup lang="ts">
import { useProjectStore } from '../../store/project.ts';
import { useBindingStore } from '../../store/binding.ts';
import { useSchemaStore } from '../../store/schema.ts';
import { computed, ref, watch } from 'vue';
import { Mode } from 'vanilla-jsoneditor';
import JsonEditorVue from 'json-editor-vue';
import FunctionDialog from './FunctionDialog.vue';

const projectStore = useProjectStore();
const project = computed(() => projectStore.project);
const currentPage = computed(() => projectStore.currentPage);
const pages = computed(() => project.value?.pages || []);

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
</script>

<template>
	<n-card>
		<n-form :model="modelValue" label-placement="top">
			<n-form-item path="title" label="项目">
				<n-input v-model:value="modelValue.title" readonly />
			</n-form-item>

			<n-form-item path="page" label="页面">
				<n-radio-group
					v-model:value="modelValue.page"
					name="page"
					@update:value="onPageSwitch"
				>
					<n-space vertical>
						<n-radio v-for="page in pages" :key="page.id" :value="page.id">
							{{ page.title }}
						</n-radio>
					</n-space>
				</n-radio-group>
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
					style="width: 100%"
					size="small"
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
		</n-form>
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
</template>

<style scoped lang="scss"></style>
