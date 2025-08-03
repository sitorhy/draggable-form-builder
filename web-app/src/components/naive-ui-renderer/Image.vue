<script setup lang="ts">
import {computed, type PropType, watch} from "vue";
import type {RendererLayout} from "../../types";
import {useBindingModel} from "../../common/renderer.ts";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const id = computed(function () {
  return modelValue.value.id;
});

const {bindingModel} = useBindingModel({
  getInitialValue(): any {
    return modelValue.value.props?.src;
  },
});

watch(modelValue, (value: RendererLayout) => {
  if (value.props) {
    bindingModel.value = value.props.src;
  }
}, {
  deep: true,
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-image v-bind="modelValue.props" :src="bindingModel"/>
</template>

<style scoped lang="scss">

</style>