<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput, NSwitch, NSelect} from "naive-ui";
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

const DATE_TYPE_OPTIONS = [
  {
    label: '日期',
    value: 'date',
  },
  {
    label: '日期时间',
    value: 'datetime',
  },
  {
    label: '日期范围',
    value: 'daterange',
  },
  {
    label: '日期时间范围',
    value: 'datetimerange',
  },
  {
    label: '月份',
    value: 'month',
  },
  {
    label: '月份范围',
    value: 'monthrange',
  },
  {
    label: '年份',
    value: 'year',
  },
  {
    label: '年份范围',
    value: 'yearrange',
  },
  {
    label: '季度',
    value: 'quarter',
  },
  {
    label: '季度范围',
    value: 'quarterrange',
  },
  {
    label: '周',
    value: 'week',
  }
];

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
      prop: 'placeholder',
      label: "占位符",
      config: {
        placeholder: '',
      }
    },
    {
      type: NSelect,
      prop: 'type',
      label: '日期类型',
      config: {
        placeholder: '',
        options: DATE_TYPE_OPTIONS
      },
    },
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em"/>
</template>