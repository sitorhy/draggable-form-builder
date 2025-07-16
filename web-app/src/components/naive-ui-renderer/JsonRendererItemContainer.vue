<!--
高亮标记容器，子组件需要暴露id
-->
<script setup lang="ts">
import {type ComponentInstance, computed, ref} from "vue";
import {useRendererStore, useSettings} from "../../store.ts";
import {Settings16Filled} from "@vicons/fluent";
import type {RendererLayout} from "../../types";
import {getComponentNameByType, useRendererActions} from "../../common/renderer.ts";

const {findNodeById} = useRendererActions();

const store = useRendererStore();
const settings = useSettings();
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

function onSettingClick() {
  store.setActiveComponent(instanceRef.value.id);
  settings.switchToPropertiesTab();
}

const config = computed(() => {
  if (!childRefId.value) {
    return null;
  }
  return findNodeById(childRefId.value);
});

const shouldRenderTooltip = computed(function () {
  return config.value && (config.value as RendererLayout).tooltip && Object.keys((config.value as RendererLayout).tooltip).length;
});
const componentName = computed(function () {
  if (shouldRenderTooltip.value) {
    return getComponentNameByType(config.value?.type);
  }
  return '';
})
</script>

<template>
  <n-popover trigger="hover" placement="top-end" v-if="shouldRenderTooltip">
    <template #trigger>
      <div @click.stop="onClick" :class="containerHighlightClasses">
        <slot :childRef="rendererItemRef"></slot>
      </div>
    </template>
    <template #header>
      <span>{{ componentName }}</span>
    </template>
    <n-button-group>
      <n-button text @click="onSettingClick">
        <template #icon>
          <n-icon>
            <Settings16Filled/>
          </n-icon>
        </template>
        <span>设置</span>
      </n-button>
    </n-button-group>
  </n-popover>
  <div v-else @click.stop="onClick" :class="containerHighlightClasses" :title="componentName">
    <slot :childRef="rendererItemRef"></slot>
  </div>
</template>

<style scoped lang="scss">
.renderer-item-container {
  position: relative;
  box-sizing: border-box;

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
    box-sizing: border-box;
  }

  &.inactive::after {
    border-color: transparent;
  }

  &.active::after {
    border-color: green;
  }
}
</style>