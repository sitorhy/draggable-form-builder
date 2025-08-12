<script setup lang="ts">
import {computed, ref} from "vue";
import {ErrorCircle20Regular} from "@vicons/fluent";

const modelValue = defineModel('modelValue', {
  type: Object,
  default: () => ({
    props: {}
  }),
});

const id = computed(function () {
  return modelValue.value.id;
});

const value = ref();

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-date-picker v-if="modelValue.props" v-bind="modelValue.props" v-model:value="value" year-format="Y"/>
  <n-empty v-else description="DatePicker">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>