<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput, NSwitch, NSelect} from "naive-ui";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import {createRendererItemConfig} from "../../../common/renderer.ts";

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
      label: '禁用',
      config: {}
    },
    {
      type: NInput,
      prop: 'label',
      label: '标签文本',
      config: {}
    },
    {
      type: NSelect,
      prop: 'component',
      label: '组件',
      config: {
        options: [
          {
            label: '文本输入',
            value: 'textInput',
          },
          {
            label: '数字输入',
            value: 'textNumberInput',
          },
          {
            label: '日期选择器',
            value: 'datePicker',
          },
          {
            label: '选择器',
            value: 'select',
          },
          {
            label: '单选框',
            value: 'radioGroup',
          },
          {
            label: '复选框',
            value: 'checkboxGroup',
          }
        ],
      },
      on: {
        'update:value': function (type: string) {
          modelValue.value.children = [
            createRendererItemConfig({
              type,
            })
          ];
        }
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="5em"/>
</template>