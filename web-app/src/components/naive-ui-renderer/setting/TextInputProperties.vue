<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput, NSwitch, NInputNumber, NSelect} from "naive-ui";
import PropertiesForm from "./PropertiesForm.vue";
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
    {
      type: NSwitch,
      prop: 'readonly',
      label: '是否只读',
      config: {}
    },
    {
      type: NInputNumber,
      prop: 'maxlength',
      label: '字数限制',
      config: {
        placeholder: ''
      },
    },
    {
      type: NSwitch,
      prop: 'showCount',
      label: '字数统计',
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
    {
      type: NSelect,
      prop: 'type',
      label: '类型',
      config: {
        placeholder: '',
        options: [
          {
            label: '文本',
            value: 'text',
          },
          {
            label: '密码',
            value: 'password',
          },
          {
            label: '文本框',
            value: 'textarea',
          }
        ],
      },
    },
    {
      type: NInputNumber,
      prop: 'rows',
      label: '文本框行数',
      visible: () => modelValue.value.type === 'textarea',
      config: {
        placeholder: '',
        min: 1,
        max: 100,
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em" />
</template>

<style scoped lang="scss">

</style>