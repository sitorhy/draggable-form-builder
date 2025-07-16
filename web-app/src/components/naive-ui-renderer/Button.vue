<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";

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
  <n-button v-bind="modelValue.props">
    <span>111</span>
  </n-button>
</template>

<style scoped lang="scss">

</style>