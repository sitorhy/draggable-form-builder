<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import {ErrorCircle20Regular} from "@vicons/fluent";
import JsonRenderer from "./JsonRenderer.vue";
import draggable from "vuedraggable"
import {useBindingModel} from "../../common/renderer.ts";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const id = computed(function () {
  return modelValue.value.id;
});

const {bindingModel} = useBindingModel();

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-radio-group class="radio-group" v-if="modelValue.props" v-bind="modelValue.props" v-model:value="bindingModel">
    <draggable class="renderer-drop" v-if="modelValue.children" v-model="modelValue.children"
               :group="{name: `renderer`, put: true}" item-key="id">
      <template #item="scope">
        <JsonRenderer v-model="scope.element"/>
      </template>
    </draggable>
  </n-radio-group>
  <n-empty v-else description="RadioGroup">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular />
      </n-icon>
    </template>
  </n-empty>
</template>

<style scoped lang="scss">
.radio-group {
  --n-hegiht: 34px;

  min-height: var(--n-hegiht);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-style: dashed;
  border-width: 1px;

  &:hover {
    background-color: rgba(0, 128, 0, 0.12);
  }

  > div {
    min-height: var(--n-hegiht);
    width: 100%;
  }
}
</style>