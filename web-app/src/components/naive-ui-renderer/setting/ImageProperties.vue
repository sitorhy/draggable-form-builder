<script setup lang="ts">
import {computed, type PropType, ref} from "vue";
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
      label: '地址',
      config: {
        placeholder: '图片资源URL',
      }
    },
    {
      type: 'slotScope',
      prop: 'width',
      label: '宽度',
    },
    {
      type: 'slotScope',
      prop: 'height',
      label: '宽度',
    },
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="3em">
    <template #width>
      <n-slider v-model:value="props.width" :step="1" :max="1000" />
    </template>
    <template #height>
      <n-slider v-model:value="props.height" :step="1" :max="1000" />
    </template>
  </PropertiesForm>
</template>

<style scoped lang="scss">

</style>