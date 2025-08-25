<script setup lang="ts">
import ComponentTagGroup from './components/pull/ComponentTagGroup.vue';
import JsonRenderer from './components/put/JsonRenderer.vue';
import { computed } from 'vue';
import BindingContext from './components/put/data/BindingContext.vue';
import { useSchemaStore } from './store/schema.ts';
import { useBindingStore } from './store/binding.ts';

const schemaStore = useSchemaStore();
const schema = computed(() => schemaStore.$state.schema);

const bindingStore = useBindingStore();
</script>

<template>
	<div class="main">
		<n-layout position="absolute">
			<n-layout-header style="height: 64px; padding: 0 11px" bordered>
				<div style="height: 100%; display: flex; align-items: center">
					<n-page-header subtitle="">
						<template #title>
							<a
								href="https://anyway.fm/"
								style="text-decoration: none; color: inherit"
								>Low-Code Engine</a
							>
						</template>
						<template #avatar>
							<n-image
								:preview-disabled="true"
								src="/icon.png"
								width="60"
								height="60"
							/>
						</template>
					</n-page-header>
				</div>
			</n-layout-header>
			<n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
				<n-layout-sider
					collapse-mode="transform"
					:collapsed-width="11"
					:native-scrollbar="false"
					:width="240"
					content-style="padding: 11px;"
					show-trigger="arrow-circle"
					bordered
				>
					<ComponentTagGroup />
				</n-layout-sider>

				<n-layout has-sider sider-placement="right">
					<n-layout-content
						embedded
						content-style="padding: 11px 24px; overflow: auto; width: 100%; height: 100%;"
						:native-scrollbar="false"
					>
						<BindingContext path="pageOne">
							<JsonRenderer v-model:schema="schema" />
						</BindingContext>
					</n-layout-content>

					<n-layout-sider
						collapse-mode="transform"
						:native-scrollbar="false"
						:collapsed-width="11"
						:width="360"
						content-style="padding: 11px;"
						show-trigger="arrow-circle"
						bordered
					>
						<textarea
							readonly
							style="width: 100%"
							:rows="30"
							:value="JSON.stringify(schema, null, 2)"
						></textarea>
						<textarea
							style="width: 100%"
							readonly
							:rows="30"
							:value="JSON.stringify(bindingStore.root, null, 2)"
						></textarea>
					</n-layout-sider>
				</n-layout>
			</n-layout>
			<n-layout-footer
				bordered
				position="absolute"
				style="height: 64px; padding: 24px"
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
