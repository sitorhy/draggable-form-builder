<script setup lang="ts">
import TextInput from "./item/TextInput.vue";
import DatePicker from "./item/DatePicker.vue";
import BindingContext from "./data/BindingContext.vue";
import JsonRendererArray from "./JsonRendererArray.vue";

defineProps({
  type: {
    type: String,
    default: '',
  },
  pull: {
    // 移出
    type: Boolean,
    default: true,
  },
  put: {
    // 移入
    type: Boolean,
    default: true,
  }
});

const schema = defineModel('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});
</script>

<template>
  <slot name="default" v-if="type === 'page'">
  </slot>
  <BindingContext :path="schema.id" v-else-if="type === 'textInput'">
    <TextInput v-model:schema="schema"/>
  </BindingContext>
  <BindingContext :path="schema.id" v-else-if="type === 'datePicker'">
    <DatePicker v-model:schema="schema"/>
  </BindingContext>
  <JsonRendererArray :pull="pull" :put="put" :schema="schema" v-else-if="type === 'array'"/>
  <n-alert v-else title="未知组件类型" type="warning">
    {{ type }}
  </n-alert>
</template>