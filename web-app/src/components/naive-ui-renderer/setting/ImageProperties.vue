<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInput} from "naive-ui";
import PropertiesForm from "../../PropertiesForm.vue";
import SizePropertyInput from "./SizePropertyInput.vue";
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
      type: NInput,
      prop: 'src',
      label: '图片地址',
    },
    {
      type: SizePropertyInput,
      prop: 'width',
      label: '宽度',
      config: {
        modelValue: modelValue.value.props?.width,
      },
      on: {
        'update:modelValue': function(newVal: string) {
          if (modelValue.value.props) {
            modelValue.value.props.width = newVal;
          }
        }
      }
    },
    {
      type: SizePropertyInput,
      prop: 'height',
      label: '宽度',
      config: {
        modelValue: modelValue.value.props?.height,
      },
      on: {
        'update:modelValue': function(newVal: string) {
          if (modelValue.value.props) {
            modelValue.value.props.height = newVal;
          }
        }
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="5em"/>
</template>

<style scoped lang="scss">

</style>