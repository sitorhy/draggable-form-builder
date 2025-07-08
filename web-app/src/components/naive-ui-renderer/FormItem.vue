<script setup lang="ts">
import {computed, type PropType} from "vue";
import type {RendererLayout} from "../../types";
import {ErrorCircle20Regular} from "@vicons/fluent";
import Renderer, {getComponentByType} from "../../common/renderer.ts";
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
  <n-form-item
      :model="modelValue.props.value"
      v-if="modelValue.props"
      v-bind="modelValue.props">
    <JsonRenderer v-if="modelValue.children" v-model="modelValue.children[0]"/>
  </n-form-item>
  <n-empty v-else description="FormItem">
    <template #icon>
      <n-icon>
        <ErrorCircle20Regular/>
      </n-icon>
    </template>
  </n-empty>
</template>

<style lang="scss" scoped>
.form {
  --n-hegiht: 34px;

  min-height: var(--n-hegiht);
  height: 100%;
  width: 100%;
  background-color: rgba(32, 128, 240, 0.16);
}
</style>