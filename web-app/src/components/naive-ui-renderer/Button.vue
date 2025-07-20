<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import draggable from "vuedraggable"
import JsonRenderer from "./JsonRenderer.vue";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const id = computed(function () {
  return modelValue.value.id;
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-button v-bind="modelValue.props">
    <draggable class="renderer-drop button" v-if="modelValue.children"
               ghost-class="ghost"
               drag-class="drag"
               v-model="modelValue.children"
               :group="{name: 'renderer', put: true}" item-key="id">
      <template #item="scope">
        <JsonRenderer v-model="modelValue.children[scope.index]"/>
      </template>
    </draggable>
  </n-button>
</template>

<style scoped lang="scss">
.button {
  --n-hegiht: 14px;
  --n-width: 14px;
  min-width: var(--n-width);
  min-height: var(--n-hegiht);
  height: 100%;
}
</style>