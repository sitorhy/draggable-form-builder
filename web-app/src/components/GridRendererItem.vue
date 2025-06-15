<script setup lang="ts">
import {type PropType, watch} from "vue";
import {v4 as uuid} from 'uuid';
import GridColumnRendererItem from "./GridColumnRendererItem.vue";
import type {RendererLayout} from "../types";

const props = defineProps({
  cols: {
    type: Number,
    default: 4
  },
  rows: {
    type: Number,
    default: 1,
  }
});

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    children: [],
  }),
});

function gridCellClasses(index: number) {
  return [(index % 2) === 0 ? 'light-green' : 'green'].filter((i) => !!i);
}

watch(() => props.cols * props.rows, function (size) {
      console.log(`grid size: ${size}`);
      let nextChildren = [];
      if (modelValue.value.children && modelValue.value.children.length) {
        nextChildren.push(...modelValue.value.children);
      }
      while (nextChildren.length < size) {
        nextChildren.push({
          type: 'gridColumn',
          id: uuid(),
          isLeaf: false,
          children: [],
        });
      }
      if (nextChildren.length > size) {
        nextChildren = nextChildren.slice(0, size);
      }
      modelValue.value.children = nextChildren;
    },
    {
      immediate: true,
    }
);
</script>

<template>
  <n-grid v-if="modelValue.children" class="grid" :x-gap="5" :y-gap="5" :cols="cols">
    <n-gi v-for="(i, index) in modelValue.children" :key="i" class="grid-item">
      <div :class="gridCellClasses(index)">
        <!--gridColumn-->
        <GridColumnRendererItem v-model="modelValue.children[index]" :child-index="index" />
      </div>
    </n-gi>
  </n-grid>
</template>

<style scoped lang="scss">
.grid {
  --n-hegiht: 34px;

  .light-green {
    min-height: var(--n-hegiht);
    height: 100%;
    width: 100%;
    background-color: rgba(0, 128, 0, 0.12);
  }

  .green {
    min-height: var(--n-hegiht);
    height: 100%;
    width: 100%;
    background-color: rgba(0, 128, 0, 0.24);
  }
}
</style>