<script setup lang="ts">
import FunctionDialog from './FunctionDialog.vue';
import { ref } from 'vue';

defineProps({
	multiple: {
		type: Boolean,
		default: true
	}
});

const funcDlgRef = ref();

const modelValue = defineModel('value', {
	type: String,
	default: ''
});

function onSelect() {
	funcDlgRef.value.select(modelValue.value.split(',').filter((v) => !!v));
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
	<FunctionDialog
		ref="funcDlgRef"
		:multiple="multiple"
		:selectable="true"
		@confirm="onConfirm"
	/>
</template>

<style scoped lang="scss"></style>
