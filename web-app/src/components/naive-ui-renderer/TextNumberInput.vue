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
  <n-input-number placeholder="数字输入" v-bind="modelValue.props" v-model="value" type="text"
                  clearable/>
</template>