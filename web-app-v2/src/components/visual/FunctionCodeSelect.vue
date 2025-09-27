<script setup lang="ts">
import FunctionDialog from './FunctionDialog.vue';
import { ref } from 'vue';

const funcDlgRef = ref();

const modelValue = defineModel('value', {
	type: String,
	default: ''
});

function onSelect() {
	funcDlgRef.value.select(modelValue.value.split(','));
}

function onConfirm(codes: string[]) {
	modelValue.value = codes.join(',');
}
</script>

<template>
	<n-input-group>
		<n-input
			placeholder=""
			readonly
			:style="{ width: '100%' }"
			v-model:value="modelValue"
		/>
		<n-button @click="onSelect" type="primary">选择</n-button>
	</n-input-group>
	<FunctionDialog ref="funcDlgRef" :selectable="true" @confirm="onConfirm" />
</template>

<style scoped lang="scss"></style>
