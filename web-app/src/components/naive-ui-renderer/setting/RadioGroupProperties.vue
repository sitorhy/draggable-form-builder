<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput, NSwitch, NInputNumber, NSelect} from "naive-ui";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const props = computed(() => {
  if (modelValue.value.props) {
    return modelValue.value.props;
  }
  return {};
});

const schema = computed(function () {
  return [
    {
      type: NSwitch,
      prop: 'disabled',
      label: '是否禁用',
      config: {}
    },
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em" />
</template>

<style scoped lang="scss">

</style>