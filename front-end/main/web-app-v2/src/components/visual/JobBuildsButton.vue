<script setup lang="ts">
import JobBuildsDialog from './JobBuildsDialog.vue';
import { computed, ref } from 'vue';
import useProjectStore from '../../store/project.ts';

const projectStore = useProjectStore();

const modalShow = ref(false);
const projectName = computed(() => projectStore.$state.project.name);
</script>

<template>
	<n-button
		:disabled="!projectName"
		type="primary"
		@click="modalShow = !modalShow"
		>构建</n-button
	>

	<JobBuildsDialog v-model="modalShow"></JobBuildsDialog>
</template>

<style scoped lang="scss"></style>
