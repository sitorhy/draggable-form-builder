<script setup lang="ts">
import {computed, defineModel, type PropType} from "vue";
import {NInput, NSwitch} from "naive-ui";
import PropertiesForm from "./PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import SelectDataSource from "./SelectDataSource.vue";

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
      type: NInput,
      prop: 'placeholder',
      label: "占位符",
      config: {
        placeholder: '',
      }
    },
    {
      type: SelectDataSource,
      prop: 'options',
      label: '选项',
      config: {}
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em"/>
</template>