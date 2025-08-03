<script setup lang="ts">
import {computed, type PropType, ref} from "vue";
import type {RendererLayout} from "../../types";
import {useBindingModel} from "../../common/renderer.ts";

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

const {bindingModel} = useBindingModel();

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-select placeholder="选择器" v-bind="modelValue.props" v-model:value="bindingModel"/>
</template>