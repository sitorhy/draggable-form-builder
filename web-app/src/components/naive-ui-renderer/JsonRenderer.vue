<script setup lang="ts">
import {type PropType} from "vue"
import draggable from "vuedraggable"
import JsonRendererItem from "./JsonRendererItem.vue";
import type {RendererLayout} from "../../types";

defineOptions({
  name: 'JsonRenderer',
});

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({type: '', id: '', children: undefined}),
});
</script>

<template>
  <div :class="[modelValue.type]">
    <!--占位元素 负责具体渲染渲染-->
    <JsonRendererItem :type="modelValue.type" v-model="modelValue">
      <!-- 拖入区域 占位元素不提供插槽即不可拖入 -->
      <draggable class="renderer-drop" v-if="modelValue.children"
                 ghost-class="ghost"
                 drag-class="drag"
                 v-model="modelValue.children"
                 :group="{name: 'renderer', put: true}" item-key="id">
        <template #item="scope">
          <JsonRenderer v-model="modelValue.children[scope.index]"/>
        </template>
      </draggable>
    </JsonRendererItem>
  </div>
</template>

<style scoped lang="scss">
.root {
  width: 100%;
  height: 100%;
  background: #eee;
}
</style>