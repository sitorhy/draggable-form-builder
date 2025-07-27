<!--
高亮标记容器，子组件需要暴露id
-->
<script setup lang="ts">
import {type ComponentInstance, computed, markRaw, onMounted, onUnmounted, ref} from "vue";
import {useRendererStore} from "../../store.ts";
import {Settings16Filled} from "@vicons/fluent";
import type {RendererLayout} from "../../types";
import {getComponentNameByType, useRendererActions} from "../../common/renderer.ts";

const {findNodeById} = useRendererActions();
const containerRef = ref();
const containerSize = ref<{
  width: number;
  height: number;
} | null>(null);
const resizeObserver = markRaw(new ResizeObserver((entries) => {
  const entry = entries[0];
  if (entry) {
    containerSize.value = {
      width: entry.borderBoxSize[0].inlineSize || entry.borderBoxSize[0].target.clientWidth,
      height: entry.borderBoxSize[0].blockSize || entry.borderBoxSize[0].target.clientHeight,
    };
  } else {
    containerSize.value = null;
  }
}));

const containerSizeStyle = computed(() => {
  if (!containerSize.value) {
    return {};
  }
  return {
    '--observe-width': `${containerSize.value.width}px`,
    '--observe-height': `${containerSize.value.height}px`,
  }
})

onMounted(() => {
  if (containerRef.value.children[0]) {
    resizeObserver.observe(containerRef.value.children[0]);
  }
});

onUnmounted(() => {
  resizeObserver.disconnect();
});

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
  return ["renderer-item-container", containerSize.value ? "observe" : "full", activeComponentId.value === childRefId.value ? "active" : "inactive"];
});

function onClick() {
  store.setActiveComponent(instanceRef.value.id);
}

function onSettingClick() {
  store.setActiveComponent(instanceRef.value.id);
}

const config = computed(() => {
  if (!childRefId.value) {
    return null;
  }
  return findNodeById(childRefId.value);
});

const shouldRenderTooltip = computed(function () {
  return config.value && (config.value as RendererLayout).tooltip && Object.keys((config.value as RendererLayout).tooltip || {}).length;
});
const componentName = computed(function () {
  if (shouldRenderTooltip.value) {
    return getComponentNameByType(config.value?.type ?? "");
  }
  return '';
});
</script>

<template>
  <n-popover trigger="hover" placement="top-end" v-if="shouldRenderTooltip">
    <template #trigger>
      <div :style="containerSizeStyle" ref="containerRef" @click.stop="onClick" :class="containerHighlightClasses">
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
  <div :style="containerSizeStyle" ref="containerRef" v-else @click.stop="onClick" :class="containerHighlightClasses"
       :title="componentName">
    <slot :childRef="rendererItemRef"></slot>
  </div>
</template>

<style scoped lang="scss">
.renderer-item-container {
  position: relative;
  box-sizing: border-box;

  &.full::after {
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

  &.observe::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: var(--observe-width);
    height: var(--observe-height);
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