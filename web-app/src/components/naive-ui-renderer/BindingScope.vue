<script setup lang="ts">
import {getCurrentInstance, onBeforeMount, onUnmounted, ref} from "vue";
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
      parentBindings.push(instance.props.id);
    }
    instance = instance?.parent;
  }
  return parentBindings.reverse().join(".");
}

const count = ref(0);

function cloneDefaultValue() {
  return JSON.parse(JSON.stringify(props.defaultValue));
}

onBeforeMount(function (): void {
  count.value++;
  const path = getBindingPath();
  console.log(path + " " + getCurrentInstance()?.uid);
  if (path) {
    bindingStore.cloneBinding(path, props.defaultValue === null || props.defaultValue === undefined ? props.defaultValue : cloneDefaultValue());
  }
});

onUnmounted(function (): void {
  const path = getBindingPath();
  console.log(count.value);
  console.log(path + " del " + getCurrentInstance()?.uid);
  if (path) {
    bindingStore.deleteBinding(path);
  }
});
</script>

<template>
 <div>
   <slot></slot>
 </div>
</template>

<style scoped lang="scss">

</style>