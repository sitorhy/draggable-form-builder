<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput, NSelect} from "naive-ui";
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
      type: NSelect,
      prop: 'tag',
      label: '标签',
      config: {
        options: [
          {
            label: 'span',
            value: 'span'
          },
          {
            label: 'p',
            value: 'p'
          },
          {
            label: 'h1',
            value: 'h1'
          },
          {
            label: 'h2',
            value: 'h2'
          },
          {
            label: 'h3',
            value: 'h3'
          },
          {
            label: 'h4',
            value: 'h4'
          },
          {
            label: 'h5',
            value: 'h5'
          },
          {
            label: 'h6',
            value: 'h6'
          }
        ]
      }
    },
    {
      type: NInput,
      prop: 'text',
      label: '文本',
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em"/>
</template>

<style scoped lang="scss">

</style>