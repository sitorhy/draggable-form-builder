<script setup lang="ts">
import {useFunctionStore} from "../../../store.ts";
import {computed, type PropType} from "vue";

const functionStore = useFunctionStore();

const props = defineProps({
  feature: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "绑定函数集",
  },
  clearable: {
    type: Boolean,
    default: true,
  }
});

const modelValue = defineModel('value', {
  type: String as PropType<string | null>,
  default: null,
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
  <n-select v-model:value="modelValue" :clearable="clearable" :options="selectCode" :placeholder="placeholder"></n-select>
</template>

<style scoped lang="scss">

</style>