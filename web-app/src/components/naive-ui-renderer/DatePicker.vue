<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import {ErrorCircle20Regular} from "@vicons/fluent";

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
  <n-date-picker v-if="modelValue.props" v-bind="modelValue.props" v-model:value="modelValue.props.value" year-format="Y" />
  <n-empty v-else description="DatePicker">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular />
      </n-icon>
    </template>
  </n-empty>
</template>