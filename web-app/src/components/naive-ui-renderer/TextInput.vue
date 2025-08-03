<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import {ErrorCircle20Regular} from "@vicons/fluent";
import {useBindingModel} from "../../common/renderer.ts";

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
  <n-input v-if="modelValue.props" v-bind="modelValue.props" v-model:value="bindingModel"/>
  <n-empty v-else description="TextNumberInput">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>