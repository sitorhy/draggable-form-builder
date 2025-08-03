<script setup lang="ts">
import {computed, getCurrentInstance, onBeforeMount, onUnmounted, type PropType, provide} from "vue";
import {useBindingStore} from "../../store.ts";

defineOptions({
  name: "BindingScope",
});

const props = defineProps({
  id: {
    type: String,
    default: ""
  },
  defaultValue: {
    type: [String, Number, Object, Array, Boolean],
    default: undefined,
  }
});

const bindingStore = useBindingStore();

function getBindingPath() {
  if (!props.id) {
    return "";
  }
  const parentBindings = [props.id];
  let instance = getCurrentInstance()?.parent;
  while (instance) {
    if (instance.type.__name === "BindingScope") {
      if (instance.props && instance.props.id) {
        parentBindings.push(instance.props.id as string);
      }
    }
    instance = instance?.parent;
  }
  return parentBindings.reverse().join(".");
}

const bindingPath = computed(() => getBindingPath());

provide("bindingPath", getBindingPath());

onBeforeMount(function (): void {
  if (bindingPath.value) {
    bindingStore.cloneBinding(bindingPath.value, structuredClone(props.defaultValue));
  }
});

onUnmounted(function (): void {
  if (bindingPath.value) {
    bindingStore.deleteBinding(bindingPath.value);
  }
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss">

</style>