<script setup lang="ts">
import TextInput from "./item/TextInput.vue";
import DatePicker from "./item/DatePicker.vue";
import JsonRendererList from "./JsonRendererList.vue";

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
  <TextInput  v-else-if="type === 'textInput'" v-model:schema="schema"/>
  <DatePicker v-else-if="type === 'datePicker'" v-model:schema="schema"/>
  <JsonRendererList :pull="pull" :put="put" :schema="schema" v-else-if="type === 'linearList'"/>
  <n-alert v-else title="未知组件类型" type="warning">
    {{ type }}
  </n-alert>
</template>