<script setup lang="ts">
import {type PropType} from "vue";
import type {RendererLayout} from "../types";
import {VueDraggable} from "vue-draggable-plus"
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
  <VueDraggable class="grid-column renderer-drop" v-if="modelValue.children" v-model="modelValue.children"
                :group="{name: 'renderer', put: true}">
    <JsonRenderer v-for="(_, index) in modelValue.children" v-model="modelValue.children[index]"/>
  </VueDraggable>
</template>

<style scoped lang="scss">
.grid-column {
  height: 100%;
}
</style>