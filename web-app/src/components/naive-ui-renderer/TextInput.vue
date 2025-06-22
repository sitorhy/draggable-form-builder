<script setup lang="ts">
import {computed, type PropType, ref} from "vue";
import type {RendererLayout} from "../../types";

const value = ref();
const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const id = computed(function () {
  return modelValue.value.id;
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-input placeholder="文本框" v-bind="modelValue.props" v-model="value" type="text"/>
</template>