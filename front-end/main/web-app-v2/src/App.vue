<script setup lang="ts">
import ComponentTagGroup from './components/pull/ComponentTagGroup.vue';
import BindingContext from './components/put/data/BindingContext.vue';
import JsonRenderer from './components/put/JsonRenderer.vue';
import JsonSchemaTree from './components/visual/JsonSchemaTree.vue';
import PropertiesBindingEditor from './components/visual/PropertiesBindingEditor.vue';
import type { TabsInst } from 'naive-ui';
import {
	computed,
	ref,
	nextTick,
	watch,
	onUnmounted,
	onMounted,
	markRaw
} from 'vue';
import { useSchemaStore } from './store/schema.ts';
import { useEmphasizeStore } from './store/emphasize.ts';
import { v4 as uuid } from 'uuid';
import ProjectView from './components/visual/ProjectView.vue';
import JsonEmphasizeContainer from './components/put/JsonEmphasizeContainer.vue';
import { useThrottle } from './components/put/common/throttle.ts';
import { useAppInit } from './components/put/common/app.ts';
import ProjectMenu from './components/visual/ProjectMenu.vue';
import JobBuildsButton from './components/visual/JobBuildsButton.vue';

useAppInit();

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
const emphasizeStore = useEmphasizeStore();

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
		if (emphasizeSchemaId.value) {
			nextTick(() => {
				emphasizeStore.watchSchema(emphasizeSchemaId.value);
			});
		}
	},
	{
		deep: true
	}
);

const contentRootDOMRef = ref<HTMLElement | null>(null);
const emphasizeRects = computed(() => emphasizeStore.$state.bounds);
const emphasizeSchemaId = computed(() => emphasizeStore.$state.schemaId);
function onWindowResize() {
	emphasizeStore.updateSchema();
}
const resizeFunc = useThrottle(onWindowResize, 0);

const resizeObserverRef = markRaw(
	new ResizeObserver(() => {
		resizeFunc();
	})
);

onUnmounted(() => {
	resizeObserverRef.disconnect();
});

onMounted(() => {
	if (contentRootDOMRef.value) {
		resizeObserverRef.observe(contentRootDOMRef.value);
	}
});
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
							<p>Low-Code Engine Demo</p>
						</template>
						<template #avatar>
							<n-image :preview-disabled="true" width="32" src="/code.png" />
						</template>
						<template #extra>
							<ProjectMenu />
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
							ref="contentRootDOMRef"
							style="
								width: 100%;
								height: 100%;
								margin: auto;
								position: relative;
							"
						>
							<BindingContext custom-path="">
								<JsonRenderer :key="schemaKey" v-model:schema="schema" />
							</BindingContext>

							<JsonEmphasizeContainer
								:container-style="{
									left: `${rect.left}px`,
									top: `${rect.top}px`,
									height: `${rect.height}px`,
									width: `${rect.width}px`
								}"
								@click:setting="onNodeSetting"
								v-for="rect in emphasizeRects"
								:key="rect.id"
								:schema-id="emphasizeSchemaId"
							/>
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

									<n-tab-pane
										name="project"
										tab="项目"
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
									<div style="width: 1200px">
										<JsonSchemaTree @node:setting="onNodeSetting" />
									</div>
								</div>

								<div
									class="custom-tabs-item"
									v-show="customTabValue === 'properties'"
								>
									<PropertiesBindingEditor />
								</div>

								<div
									class="custom-tabs-item"
									v-show="customTabValue === 'project'"
								>
									<ProjectView />
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
				<n-space justify="space-between">
					<div>
						<span style="font-weight: bold; font-size: 10px"></span>
					</div>
					<div>
						<n-space>
							<JobBuildsButton></JobBuildsButton>
						</n-space>
					</div>
				</n-space>
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
