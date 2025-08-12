<script setup lang="ts">
import TextInput from "./item/TextInput.vue";
import DatePicker from "./item/DatePicker.vue";

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

const modelValue = defineModel('modelValue', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});
</script>

<template>
  <slot name="default" v-if="type === 'page'">
  </slot>
  <TextInput v-else-if="type === 'textInput'"/>
  <DatePicker v-else-if="type === 'datePicker'"/>
  <div v-else>
    <n-tag type="info">
      <span>{{ type }}}</span>
    </n-tag>
  </div>
</template>