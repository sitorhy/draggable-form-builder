<script setup lang="ts">
import {computed, markRaw, type PropType} from "vue";
import PropertiesForm from "./PropertiesForm.vue";
import type {RendererLayout} from "../../../types";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const units = markRaw([
  {
    label: 'px',
    value: 'px'
  },
  {
    label: 'em',
    value: 'em'
  },
  {
    label: '%',
    value: '%'
  },
]);

const props = computed(() => {
  if (modelValue.value.props) {
    return modelValue.value.props;
  }
  return {};
});

const schema = computed(function () {
  return [
    {
      type: 'slotScope',
      label: '内边距',
      prop: 'padding',
      config: {
        placeholder: '',
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props.style" label-width="6em">
    <template #padding>
      <div>
        
      </div>
    </template>
  </PropertiesForm>
</template>