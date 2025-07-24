<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NSwitch, NSelect, NInputNumber} from "naive-ui";
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
    {
      type: NSwitch,
      prop: 'inline',
      label: "行内表单",
      config: {
        placeholder: '',
      }
    },
    {
      type: NSwitch,
      prop: 'showLabel',
      label: "显示标签",
      config: {
        placeholder: '',
      }
    },
    {
      type: NInputNumber,
      prop: 'labelWidth',
      label: '标签宽度',
      config: {
        placeholder: '',
      },
    },
    {
      type: NSelect,
      prop: 'labelAlign',
      label: '标签对齐',
      config: {
        options: [
          {
            label: '左对齐',
            value: 'left',
          },
          {
            label: '右对齐',
            value: 'right',
          }
        ]
      }
    },
    {
      type: NSelect,
      prop: 'labelPlacement',
      label: '标签位置',
      config: {
        options: [
          {
            label: '左右结构',
            value: 'left',
          },
          {
            label: '上下结构',
            value: 'top',
          }
        ]
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em"/>
</template>