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
import PropertiesContext from './data/PropertiesContext.vue';
import Form from './item/Form.vue';
import FormItem from './item/FormItem.vue';
import Grid from './item/Grid.vue';
import type { RendererItemDefinition } from '../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const type = computed(() => schema.value.type);
</script>

<template>
	<BindingContext :schema="schema" v-if="type === 'page'">
		<JsonEmphasizeContainer
			:schema-id="schema.id"
			:container-style="{ width: '100%', height: '100%' }"
		>
			<Page v-model:schema="schema">
				<slot></slot>
			</Page>
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'form'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<Form v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'formItem'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<FormItem v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'textInput'">
		<PropertiesContext :schema="schema">
			<JsonEmphasizeContainer :schema-id="schema.id">
				<TextInput v-model:schema="schema" />
			</JsonEmphasizeContainer>
		</PropertiesContext>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'datePicker'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<PropertiesContext :schema="schema">
				<DatePicker v-model:schema="schema" />
			</PropertiesContext>
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'list'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<List v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext custom-path="" :schema="schema" v-else-if="type === 'grid'">
		<JsonEmphasizeContainer :schema-id="schema.id">
			<Grid v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext
		custom-path=""
		:schema="schema"
		v-else-if="type === 'container'"
	>
		<JsonEmphasizeContainer :schema-id="schema.id">
			<JsonRendererContainer v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<BindingContext :schema="schema" v-else-if="type === 'linearList'">
		<JsonEmphasizeContainer :schema-id="schema.id" tag="div">
			<JsonRendererList v-model:schema="schema" />
		</JsonEmphasizeContainer>
	</BindingContext>
	<n-alert v-else :title="`未知组件类型 ${type}`" type="warning">
		{{ schema }}
	</n-alert>
</template>
