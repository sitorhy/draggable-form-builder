<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NSelect, NSwitch} from "naive-ui";
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
      config: {
        placeholder: ''
      },
    },
    {
      type: NSelect,
      prop: 'type',
      label: '类型',
      config: {
        options: [
          {
            label: 'default',
            value: 'default'
          },
          {
            label: 'tertiary',
            value: 'tertiary'
          },
          {
            label: 'primary',
            value: 'primary'
          },
          {
            label: 'success',
            value: 'success'
          },
          {
            label: 'info',
            value: 'info'
          },
          {
            label: 'warning',
            value: 'warning'
          },
          {
            label: 'error',
            value: 'error'
          }
        ]
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