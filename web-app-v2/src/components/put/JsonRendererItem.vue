<script setup lang="ts">
import { computed } from 'vue';
import Page from './item/Page.vue';
import TextInput from './item/TextInput.vue';
import DatePicker from './item/DatePicker.vue';
import JsonRendererList from './JsonRendererList.vue';
import JsonRendererContainer from './JsonRendererContainer.vue';
import BindingContext from './data/BindingContext.vue';
import List from './item/List.vue';
import JsonEmphasizeContainer from './JsonEmphasizeContainer.vue';
import type { RendererItemDefinition } from '../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const type = computed(() => schema.value.type);
</script>

<template>
	<BindingContext v-if="type === 'page'" :path="schema.id">
		<JsonEmphasizeContainer
			:schema-id="schema.id"
			:container-style="{ width: '100%', height: '100%' }"
		>
			<Page>
				<slot></slot>
			</Page>
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'textInput'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<TextInput v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'datePicker'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<DatePicker v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'list'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<List v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'container'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<JsonRendererContainer v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :path="schema.id" v-else-if="type === 'linearList'">
		<JsonEmphasizeContainer :schema-id="schema.id" tag="div">
			<JsonRendererList v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<n-alert v-else :title="`未知组件类型 ${type}`" type="warning">
		{{ schema }}
	</n-alert>
</template>
