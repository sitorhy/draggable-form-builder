<script setup lang="ts">
import {type PropType} from "vue";
import type {RendererLayout} from "../../types";
import draggable from "vuedraggable"
import JsonRenderer from "./JsonRenderer.vue";

defineProps({
  childIndex: {
    type: Number,
    default: 0,
  },
  pull: {
    // 移出
    type: Boolean,
    default: true,
  },
  put: {
    // 移入
    type: Boolean,
    default: true,
  }
});

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    children: [],
  }),
});
</script>

<template>
  <draggable class="grid-column renderer-drop" v-if="modelValue.children" v-model="modelValue.children"
             :group="{name: `renderer`, put: put, pull: pull}" item-key="id">
    <template #item="scope">
      <JsonRenderer v-model="scope.element"/>
    </template>
  </draggable>
</template>

<style scoped lang="scss">
.grid-column {
  height: 100%;
}
</style>