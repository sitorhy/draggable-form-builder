<script setup lang="ts">
import {computed, defineModel, type PropType} from "vue";
import {NInput, NSwitch, NInputNumber, NSelect} from "naive-ui";
import PropertiesForm from "./PropertiesForm.vue";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<Record<string, any>>,
  default: () => ({}),
});

const schema = computed(function () {
  return [
    {
      type: NInput,
      prop: 'defaultValue',
      label: '默认值',
      config: {
        placeholder: ''
      }
    },
    {
      type: NSwitch,
      prop: 'disabled',
      label: '是否禁用',
      config: {}
    },
    {
      type: NInputNumber,
      prop: 'maxlength',
      label: '最大长度',
      config: {
        placeholder: ''
      },
    },
    {
      type: NInputNumber,
      prop: 'minlength',
      label: '最小长度',
      config: {
        placeholder: ''
      },
    },
    {
      type: NInput,
      prop: 'placeholder',
      label: '占位符',
      config: {
        placeholder: ''
      },
    },
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="modelValue" />
</template>

<style scoped lang="scss">

</style>