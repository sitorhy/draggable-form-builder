<script setup lang="ts">
import {useDatasourceStore} from "../../../store.ts";
import {computed, type PropType} from "vue";

const datasourceStore = useDatasourceStore();

const props = defineProps({
  feature: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "绑定数据集",
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

const selectDatasource = computed(() => {
  return datasourceStore.datasource.filter((datasource) => {
    return props.feature ? datasource.feature === props.feature : true;
  }).map((datasource) => {
    return {
      label: datasource.name,
      value: datasource.id,
    }
  });
});
</script>

<template>
  <n-select v-model:value="modelValue" :clearable="clearable" :options="selectDatasource" :placeholder="placeholder"></n-select>
</template>

<style scoped lang="scss">

</style>