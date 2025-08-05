<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const style = computed(() => modelValue.value.props.style);

const id = computed(function () {
  return modelValue.value.id;
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <component :is="modelValue.props?.tag || 'span'" :style="style">{{ modelValue.props?.text }}</component>
</template>

<style scoped lang="scss">

</style>