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
  // 路径转为数字： ['0'] 和 [0] 的区别，配合bracket使用
  parseNumber: {
    type: Boolean,
    default: false,
  },
  // 使用中括号访问
  bracket: {
    type: Boolean,
    default: false,
  },
  // 局部上下文
  componentContext: {
    type: Object,
    default: null,
  }
});

function getCurrentPathConfig(props: {
  bracket: boolean;
  path: string;
  parseNumber: boolean;
}) {
  return {
    sep: props.bracket ? '' : '.',
    path: props.bracket ? ['[', props.parseNumber ? props.path : `'${props.path}'`, ']'].join('') : props.path,
  };
}

function getBindingPath() {
  if (!props.path) {
    return "";
  }
  const parentBindings = [getCurrentPathConfig(props)];
  let instance = getCurrentInstance()?.parent;
  while (instance) {
    if (instance.type.__name === "BindingContext") {
      if (instance.props && instance.props.path) {
        parentBindings.push(getCurrentPathConfig(instance.props as {
          bracket: boolean;
          path: string;
          parseNumber: boolean;
        }));
      }
    }
    instance = instance?.parent;
  }
  return parentBindings.reverse().map((item) => {
    return `${item.sep}${item.path}`;
  }).join('');
}

provide('bindingPath', getBindingPath());
</script>

<template>
  <slot v-bind="$attrs"></slot>
</template>