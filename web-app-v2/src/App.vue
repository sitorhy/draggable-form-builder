<script setup lang="ts">
import ComponentTagGroup from './components/pull/ComponentTagGroup.vue';
import BindingContext from './components/put/data/BindingContext.vue';
import JsonRenderer from './components/put/JsonRenderer.vue';
import JsonSchemaTree from './components/visual/JsonSchemaTree.vue';
import PropertiesBindingEditor from './components/visual/PropertiesBindingEditor.vue';
import JsonEditorVue from 'json-editor-vue';
import type { TabsInst } from 'naive-ui';
import { computed, ref, nextTick, watch } from 'vue';
import { useSchemaStore } from './store/schema.ts';
import { useBindingStore } from './store/binding.ts';
import { v4 as uuid } from 'uuid';
import { Mode } from 'vanilla-jsoneditor';
import FunctionDialog from './components/visual/FunctionDialog.vue';

const contentStyle = computed(() => {
	return {
		padding: '11px 24px',
		overflow: 'auto',
		width: '100%',
		height: '100%',
		background: 'lightgray',
		backgroundImage: `repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%)`,
		backgroundSize: `16px 16px`,
		border: 'solid 1px #eee'
	};
});

const schemaStore = useSchemaStore();
const bindingStore = useBindingStore();

const schema = computed(() => schemaStore.schema);

const tabsInstRef = ref<TabsInst | null>(null);
const customTabValue = ref('schema');

function onTabChange(tab: string) {
	customTabValue.value = tab;
}

function onNodeSetting() {
	customTabValue.value = 'properties';
	nextTick(() => tabsInstRef.value?.syncBarPosition());
}

const schemaKey = ref(uuid());

watch(
	schema,
	function () {
		schemaKey.value = uuid();
	},
	{
		deep: true
	}
);

const schemaDrawerShow = ref(false);
const bindingDrawerShow = ref(false);
const editorProps = computed(() => {
	return {
		mode: Mode.text,
		readOnly: true
	};
});

const funModelShow = ref(false);
function openFunctionDlg() {
	funModelShow.value = true;
}
</script>

<template>
	<div class="main">
		<n-layout position="absolute">
			<n-layout-header style="height: 48px; padding: 0 11px" bordered>
				<div
					style="width: 100%; height: 100%; display: flex; align-items: center"
				>
					<n-page-header subtitle="" style="width: 100%">
						<template #title>
							<p>Low-Code Engine</p>
						</template>
						<template #avatar>
							<n-image width="32" src="/code.png" />
						</template>
						<template #extra>
							<n-space>
								<n-button type="primary" @click="schemaDrawerShow = true"
									>模式</n-button
								>
								<n-button type="primary" @click="bindingDrawerShow = true"
									>状态</n-button
								>
								<n-button type="primary" @click="openFunctionDlg"
									>函数集</n-button
								>
							</n-space>
						</template>
					</n-page-header>
				</div>
			</n-layout-header>
			<n-layout has-sider position="absolute" style="top: 48px; bottom: 48px">
				<n-layout-sider
					collapse-mode="transform"
					:collapsed-width="11"
					:native-scrollbar="false"
					:width="280"
					content-style="padding: 11px;"
					show-trigger="arrow-circle"
					bordered
				>
					<ComponentTagGroup />
				</n-layout-sider>

				<n-layout has-sider sider-placement="right">
					<n-layout-content
						embedded
						:content-style="contentStyle"
						:native-scrollbar="false"
					>
						<div
							style="
								width: fit-content;
								height: 100%;
								margin: auto;
								position: relative;
							"
						>
							<BindingContext custom-path="">
								<JsonRenderer :key="schemaKey" v-model:schema="schema" />
							</BindingContext>
						</div>
					</n-layout-content>

					<n-layout-sider
						collapse-mode="transform"
						:native-scrollbar="false"
						:collapsed-width="11"
						:width="360"
						content-style="padding: 11px; height: 100%;"
						show-trigger="arrow-circle"
						bordered
					>
						<div class="custom-tabs">
							<div class="custom-tabs-header">
								<n-tabs
									ref="tabsInstRef"
									type="line"
									default-value="schema"
									:animated="false"
									v-model:value="customTabValue"
									@update:value="onTabChange"
								>
									<n-tab-pane name="schema" tab="大纲" display-directive="show">
									</n-tab-pane>

									<n-tab-pane
										name="properties"
										tab="属性"
										display-directive="show"
									>
									</n-tab-pane>
								</n-tabs>
							</div>
							<div class="custom-tabs-body">
								<div
									class="custom-tabs-item"
									v-show="customTabValue === 'schema'"
								>
									<JsonSchemaTree @node:setting="onNodeSetting" />
								</div>

								<div
									class="custom-tabs-item"
									v-show="customTabValue === 'properties'"
								>
									<PropertiesBindingEditor />
								</div>
							</div>
						</div>
					</n-layout-sider>
				</n-layout>
			</n-layout>
			<n-layout-footer
				bordered
				position="absolute"
				style="height: 48px; padding: 8px"
			>
				城府路
			</n-layout-footer>
		</n-layout>
	</div>

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
			<JsonEditorVue :modelValue="bindingStore.root" v-bind="editorProps" />
		</n-drawer-content>
	</n-drawer>

	<FunctionDialog v-model="funModelShow" />
</template>

<style scoped>
.main {
	height: 100%;
	width: 100%;
}
</style>

<style lang="scss" scoped>
.custom-tabs {
	height: 100%;
	display: flex;
	flex-direction: column;

	.custom-tabs-header {
		flex-shrink: 0;
	}

	.custom-tabs-body {
		flex-grow: 1;
		overflow: hidden;

		.custom-tabs-item {
			height: 100%;
			overflow: auto;

			&.non-scrollable {
				overflow: hidden;
			}
		}
	}
}
</style>
