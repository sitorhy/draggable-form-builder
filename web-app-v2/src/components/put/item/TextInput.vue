<script setup lang="ts">
import {computed, ref} from "vue";
import {ErrorCircle20Regular} from "@vicons/fluent";

const modelValue = defineModel('modelValue', {
  type: Object,
  default: () => ({
    props: {}
  }),
});

const value = ref();

const id = computed(function () {
  return modelValue.value.id;
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-input v-if="modelValue.props" v-bind="modelValue.props" v-model:value="value"/>
  <n-empty v-else description="TextNumberInput">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>