<script setup lang="ts">
import {getCurrentInstance, provide} from "vue";

defineOptions({
  name: "BindingContext"
});

const props = defineProps({
  path: {
    type: String,
    default: '',
  },
  // 局部上下文
  componentContext: {
    type: Object,
    default: null,
  }
});

function getBindingPath() {
  if (!props.path) {
    return "";
  }
  const parentBindings = [props.path];
  let instance = getCurrentInstance()?.parent;
  while (instance) {
    if (instance.type.__name === "BindingContext") {
      if (instance.props && instance.props.path) {
        parentBindings.push(instance.props.path as string);
      }
    }
    instance = instance?.parent;
  }
  return parentBindings.reverse().join(".");
}

provide('bindingPath', getBindingPath());
</script>

<template>
  <slot v-bind="$attrs"></slot>
</template>