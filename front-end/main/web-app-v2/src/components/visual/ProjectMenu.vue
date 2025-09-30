<script setup lang="ts">
import { computed, h, type Component } from 'vue';
import { Folder24Regular, FolderOpen24Regular } from '@vicons/fluent';
import { NIcon } from 'naive-ui';
import { useProjectStore } from '../../store/project.ts';

const projectStore = useProjectStore();

function renderIcon(icon: Component) {
	return () => {
		return h(NIcon, null, {
			default: () => h(icon)
		});
	};
}

const options = computed(() => {
	return projectStore.$state.projectList.map((i) => {
		return {
			label: i.title,
			value: i.id,
			icon:
				projectStore.$state.project.id === i.id
					? renderIcon(FolderOpen24Regular)
					: renderIcon(Folder24Regular)
		};
	});
});
</script>

<template>
	<n-dropdown :options="options">
		<n-button type="primary">项目</n-button>
	</n-dropdown>
</template>

<style scoped lang="scss"></style>
