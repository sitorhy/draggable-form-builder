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
  <n-radio :value="modelValue.props?.value">{{ modelValue.props?.label }}</n-radio>
</template>

<style scoped lang="scss">

</style>