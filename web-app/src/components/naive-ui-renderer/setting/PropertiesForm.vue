<script setup lang="ts">
import {defineModel, ref, type PropType, type Component} from "vue";

defineProps({
  schema: {
    type: Array as PropType<{
      type: Component;
      label: string;
      prop: string;
      config?: Record<string, any>;
    }[]>,
    default: () => [],
  }
});

const formRef = ref();

const modelValue = defineModel('modelValue', {
  type: Object as PropType<Record<string, any>>,
  default: () => ({}) as Record<string, any>,
});
</script>

<template>
  <n-form
      ref="formRef"
      :model="modelValue"
      label-placement="left"
  >
    <n-form-item v-for="item in schema" :label="item.label" :path="item.prop">
      <component :is="item.type" v-bind="item.config" v-model:value="modelValue[item.prop]"/>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">

</style>