<script setup lang="ts">
import {type PropType} from "vue";
import type {RendererLayout} from "../types";
import draggable from 'vuedraggable';
import JsonRenderer from "./JsonRenderer.vue";

defineProps({
  childIndex: {
    type: Number,
    default: 0,
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
                :group="{name: `renderer`, put: true}" item-key="id">
    <template #item="{element: i, index}">
      <JsonRenderer v-model="modelValue.children[index]"/>
    </template>
  </draggable>
</template>

<style scoped lang="scss">
.grid-column {
  height: 100%;
}
</style>