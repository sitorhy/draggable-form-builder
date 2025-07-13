<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import draggable from "vuedraggable";
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

const containerStyle = computed(() => {
  return modelValue.value.props?.style || {};
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <div class="container-wrapper">
    <draggable class="container renderer-drop" v-if="modelValue.children"
               :style="containerStyle"
               ghost-class="ghost"
               drag-class="drag"
               v-model="modelValue.children"
               :group="{name: 'renderer', put: true}" item-key="id">
      <template #item="scope">
        <JsonRenderer v-model="modelValue.children[scope.index]"/>
      </template>
    </draggable>
  </div>
</template>

<style scoped lang="scss">
.container-wrapper {
  --n-hegiht: 34px;
  min-height: var(--n-hegiht);
  border-style: dashed;
  border-width: 1px;
}

.container {
  min-height: var(--n-hegiht);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>