<script setup lang="ts">
import {computed, ref} from "vue";
import {ErrorCircle20Regular} from "@vicons/fluent";

const schema = defineModel('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});

const id = computed(function () {
  return schema.value.id;
});

const value = ref();

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-date-picker v-if="schema.props" v-bind="schema.props" v-model:value="value" year-format="Y"/>
  <n-empty v-else description="DatePicker">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>