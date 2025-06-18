<script setup lang="ts">
import {type PropType} from 'vue';
import {VueDraggable} from 'vue-draggable-plus';
import JsonRendererItem from "./JsonRendererItem.vue";
import type {RendererLayout} from "../types";

defineOptions({
  name: 'JsonRenderer',
});

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => [],
});
</script>

<template>
  <!--占位元素 负责具体渲染渲染-->
  <JsonRendererItem :type="modelValue.type" :v-slot="modelValue.type" v-model="modelValue">
    <!-- 拖入区域 占位元素不提供插槽即不可拖入 -->
    <VueDraggable class="renderer-drop" v-if="modelValue.children" v-model="modelValue.children"
                  :group="{name: `renderer`, put: true}">
      <JsonRenderer v-for="(_, index) in modelValue.children" v-model="modelValue.children[index]"/>
    </VueDraggable>
  </JsonRendererItem>
</template>

<style scoped lang="scss">
/* 拖入范围应该沾满占位元素的区域 */
.renderer-drop {
  width: 100%;
  height: 100%;
}
</style>