<script setup lang="ts">
import {useDatasourceStore} from "../../../store.ts";
import {computed} from "vue";

const datasourceStore = useDatasourceStore();

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
  <NSelect v-model:value="modelValue" :clearable="true" :options="selectDatasource" placeholder="绑定数据集"></NSelect>
</template>

<style scoped lang="scss">

</style>