<script setup lang="ts">
import {useFunctionStore} from "../../../store.ts";
import {computed} from "vue";

const functionStore = useFunctionStore();

const props = defineProps({
  feature: {
    type: String,
    default: "",
  }
});

const modelValue = defineModel('value', {
  type: String,
  default: "",
});

const selectCode = computed(() => {
  return functionStore.functions.filter((code) => {
    return props.feature ? code.feature === code.feature : true;
  }).map((code) => {
    return {
      label: code.name,
      value: code.id,
    }
  });
});
</script>

<template>
  <NSelect v-model:value="modelValue" :clearable="true" :options="selectCode" placeholder="绑定函数集"></NSelect>
</template>

<style scoped lang="scss">

</style>