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
  return ["renderer-item-container", activeComponentId.value === childRefId.value ? "active" : "inactive"];
});

function onClick() {
  store.setActiveComponent(instanceRef.value.id);
}
</script>

<template>
  <div @click.stop="onClick" :class="containerHighlightClasses">
    <slot :childRef="rendererItemRef"></slot>
  </div>
</template>

<style scoped lang="scss">
.renderer-item-container {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-style: dashed;
    border-width: 2px;
    z-index: 5;
    pointer-events: none;
  }

  &.inactive::after {
    border-color: transparent;
  }

  &.active::after {
    border-color: green;
  }
}
</style>