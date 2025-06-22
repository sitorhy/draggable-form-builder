<!--
高亮标记容器，子组件需要暴露id
-->
<script setup lang="ts">
import {type ComponentInstance, computed, ref} from "vue";
import {useRendererStore} from "../../store.ts";

const store = useRendererStore();
const activeComponentId = computed(function () {
  return store.activeRendererItemInfo.id;
});

const childRefId = computed(function () {
  return instanceRef.value?.id;
});

const instanceRef = ref();
const rendererItemRef = function (instance: ComponentInstance<any>) {
  instanceRef.value = instance;
};

const containerHighlightClasses = computed(function () {
  return [activeComponentId.value === childRefId.value ? "active" : "inactive"];
});

function onClick() {
  store.setActiveComponent(instanceRef.value.id);
}
</script>

<template>
  <div @click.stop="onClick" class="renderer-item-container" :class="containerHighlightClasses">
    <slot :childRef="rendererItemRef"></slot>
  </div>
</template>

<style scoped lang="scss">
.renderer-item-container {
  border-style: dashed;
  border-width: 2px;

  &.inactive {
    border-color: transparent;
  }

  &.active {
    border-color: green;
  }
}
</style>