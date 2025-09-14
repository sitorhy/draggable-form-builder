<script setup lang="ts">
import ComponentTagGroup from './components/pull/ComponentTagGroup.vue';
import BindingContext from './components/put/data/BindingContext.vue';
import JsonRenderer from './components/put/JsonRenderer.vue';
import JsonSchemaTree from './components/visual/JsonSchemaTree.vue';
import PropertiesBindingEditor from './components/visual/PropertiesBindingEditor.vue';
import type { TabsInst } from 'naive-ui';
import { computed, ref, nextTick, watch } from 'vue';
import { useSchemaStore } from './store/schema.ts';
import { useBindingStore } from './store/binding.ts';
import { v4 as uuid } from 'uuid';

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
</script>

<template>
	<div class="main">
		<n-layout position="absolute">
			<n-layout-header style="height: 48px; padding: 0 11px" bordered>
				<div style="height: 100%; display: flex; align-items: center">
					<n-page-header subtitle="">
						<template #title>
							<p>Low-Code Engine</p>
						</template>
						<template #avatar></template>
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
						<div style="width: fit-content; height: 100%; margin: auto">
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
									<n-tab-pane
										name="schema"
										tab="大纲"
										display-directive="show"
									>
									</n-tab-pane>

									<n-tab-pane
										name="properties"
										tab="属性"
										display-directive="show"
									>
									</n-tab-pane>

									<n-tab-pane name="test" tab="模式" display-directive="show">
									</n-tab-pane>

									<n-tab-pane name="test2" tab="绑定" display-directive="show">
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

								<div
									class="custom-tabs-item non-scrollable"
									v-show="customTabValue === 'test'"
								>
									<textarea
										readonly
										style="width: 98%; height: 99%"
										:value="JSON.stringify(schema, null, 2)"
									></textarea>
								</div>

								<div
									class="custom-tabs-item non-scrollable"
									v-show="customTabValue === 'test2'"
								>
									<textarea
										style="width: 98%; height: 99%"
										readonly
										:value="JSON.stringify(bindingStore.root, null, 2)"
									></textarea>
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
