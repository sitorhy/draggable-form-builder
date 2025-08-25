<script setup lang="ts">
import TextInput from './item/TextInput.vue';
import DatePicker from './item/DatePicker.vue';
import JsonRendererList from './JsonRendererList.vue';
import JsonRendererContainer from './JsonRendererContainer.vue';
import BindingContext from './data/BindingContext.vue';
import List from './item/List.vue';
import type { RendererItemDefinition } from '../../types.ts';
import { computed } from 'vue';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const type = computed(() => schema.value.type);
</script>

<template>
	<slot v-if="type === 'page'"> </slot>
	<BindingContext :path="schema.id" v-else-if="type === 'textInput'">
		<TextInput v-model:schema="schema" />
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'datePicker'">
		<DatePicker v-model:schema="schema" />
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'list'">
		<List v-model:schema="schema" />
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'container'">
		<JsonRendererContainer v-model:schema="schema" />
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'linearList'">
		<JsonRendererList v-model:schema="schema" />
	</BindingContext>
	<n-alert v-else :title="`未知组件类型 ${type}`" type="warning">
		{{ schema }}
	</n-alert>
</template>
