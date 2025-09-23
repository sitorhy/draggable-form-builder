<script setup lang="ts">
import { computed } from 'vue';
import type { RendererItemDefinition } from '../../types.ts';
import Page from './item/Page.vue';
import TextInput from './item/TextInput.vue';
import DatePicker from './item/DatePicker.vue';
import JsonRendererList from './JsonRendererList.vue';
import JsonRendererContainer from './JsonRendererContainer.vue';
import BindingContext from './data/BindingContext.vue';
import List from './item/List.vue';
import PropertiesContext from './data/PropertiesContext.vue';
import Form from './item/Form.vue';
import FormItem from './item/FormItem.vue';
import Grid from './item/Grid.vue';
import Ellipsis from './item/Ellipsis.vue';
import Image from './item/Image.vue';
import RadioGroup from './item/RadioGroup.vue';
import Radio from './item/Radio.vue';
import Equation from './item/Equation.vue';
import RichText from './item/RichText.vue';

const schema = defineModel<RendererItemDefinition>('schema', {
	type: Object,
	default: () => ({})
});

const type = computed(() => schema.value.type);

const customPath = computed(function () {
	if (['grid', 'container'].includes(type.value)) {
		return '';
	}
	return undefined;
});
</script>

<template>
	<BindingContext :schema="schema" :custom-path="customPath">
		<PropertiesContext :schema="schema">
			<Page v-model:schema="schema" v-if="type === 'page'">
				<slot></slot>
			</Page>
			<Form v-model:schema="schema" v-else-if="type === 'form'" />
			<FormItem v-model:schema="schema" v-else-if="type === 'formItem'" />
			<TextInput v-model:schema="schema" v-else-if="type === 'textInput'" />
			<DatePicker v-model:schema="schema" v-else-if="type === 'datePicker'" />
			<List v-model:schema="schema" v-else-if="type === 'list'" />
			<Grid v-model:schema="schema" v-else-if="type === 'grid'" />
			<JsonRendererContainer
				v-model:schema="schema"
				v-else-if="type === 'container'"
			/>
			<JsonRendererList
				v-model:schema="schema"
				v-else-if="type === 'linearList'"
			/>
			<Ellipsis v-model:schema="schema" v-else-if="type === 'ellipsis'" />
			<RichText v-model:schema="schema" v-else-if="type === 'richText'" />
			<Image v-model:schema="schema" v-else-if="type === 'image'" />
			<RadioGroup v-model:schema="schema" v-else-if="type === 'radioGroup'" />
			<Radio v-model:schema="schema" v-else-if="type === 'radio'" />
			<Equation v-model:schema="schema" v-else-if="type === 'equation'" />
			<n-alert v-else :title="`未知组件类型 ${type}`" type="warning">
				{{ schema }}
			</n-alert>
		</PropertiesContext>
	</BindingContext>
</template>
