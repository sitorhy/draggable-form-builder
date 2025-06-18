<script setup lang="ts">
import {type PropType, ref} from 'vue';
import GridRendererItem from "./GridRendererItem.vue";
import type {RendererLayout} from "../types";

defineProps({
  type: {
    type: String,
    default: '',
  },
  config: {
    type: Object,
    default: () => ({}),
  }
});

const value = ref();
const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => [],
});
</script>

<template>
  <div :class="[type]">
    <slot v-if="type === 'root'" name="root">
      <slot></slot>
    </slot>
    <slot v-else-if="type === 'textInput'" name="textInput">
      <n-input placeholder="文本框" v-bind="config" v-model="value" type="text"/>
    </slot>
    <slot v-else-if="type === 'textNumberInput'" name="textNumberInput">
      <n-input-number placeholder="数字输入" v-bind="config" v-model="value" type="text" clearable/>
    </slot>
    <slot v-else-if="type === 'datePicker'" name="datePicker">
      <n-date-picker placeholder="日期选择器" v-bind="config" v-model="value" type="date"/>
    </slot>
    <slot v-else-if="type === 'select'" name="select">
      <n-select placeholder="选择器" v-bind="config" v-model="value"/>
    </slot>
    <slot v-else-if="type === 'grid'" name="grid">
      <GridRendererItem v-bind="modelValue.props" :children="modelValue.children" />
    </slot>
    <slot v-else name="default">
      <div></div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.root {
  width: 100%;
  height: 100%;
  background: #eee;
}
</style>