<script setup lang="ts">
import {ref, computed, type PropType, type Component} from "vue";

const props = defineProps({
  schema: {
    type: Array as PropType<{
      type: Component;
      label: string;
      prop: string;
      config?: Record<string, any>;
      visible?: () => boolean;
    }[]>,
    default: () => [],
  }
});

const formRef = ref();

const modelValue = defineModel('modelValue', {
  type: Object as PropType<Record<string, any>>,
  default: () => ({}) as Record<string, any>,
});

const visibleItems = computed(function () {
  return props.schema.filter(function (item) {
    return shouldRenderItem(item);
  });
});

function shouldRenderItem(item: {
  visible?: () => boolean;
}): boolean {
  if (typeof item.visible === 'function') {
    return item.visible();
  }
  return true;
}

const defaultHandlers = computed(() => ({}));

</script>

<template>
  <n-form
      v-bind="$attrs"
      ref="formRef"
      :model="modelValue"
      label-placement="left"
  >
    <n-form-item v-for="item in visibleItems" :label="item.label" :path="item.prop">
      <component :is="item.type" v-bind="item.config" v-on="item.on || defaultHandlers" v-model:value="modelValue[item.prop]"/>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">

</style>