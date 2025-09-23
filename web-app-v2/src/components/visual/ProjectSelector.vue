<script setup lang="ts">
import { type CascaderOption } from 'naive-ui';
import { useProjectStore } from '../../store/project.ts';
import { computed } from 'vue';

const projectStore = useProjectStore();
const projectOptions = computed<CascaderOption[]>(() => {
	return projectStore.projects.map((p) => {
		return {
			value: p.id,
			label: p.name,
			disabled: false,
			children: (p.pages || []).map((page: any) => {
				return {
					value: page.id,
					label: page.name,
					project: p.id,
					disabled: false
				};
			})
		};
	});
});

const currentPage = computed(() => {
	return projectStore.currentPage;
});

function handleUpdateValue(value: any, option: any) {
	projectStore.watchProject(option.project, value);
}
</script>

<template>
	<div style="min-width: 512px">
		<n-form-item label-placement="left" label="项目页面">
			<n-cascader
				:value="currentPage"
				placeholder=""
				expand-trigger="click"
				:options="projectOptions"
				check-strategy="child"
				:filterable="true"
				@update:value="handleUpdateValue"
			/>
		</n-form-item>
	</div>
</template>

<style scoped lang="scss"></style>
