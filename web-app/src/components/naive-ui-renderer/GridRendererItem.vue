<script setup lang="ts">
import {computed, type PropType} from "vue";
import GridColumnRendererItem from "./GridColumnRendererItem.vue";
import type {RendererLayout} from "../../types";
import {InboxOutlined} from "@vicons/material";

defineProps({
  cols: {
    type: Number,
    default: 4
  },
  children: {
    type: Array as PropType<RendererLayout[]>,
    default: () => [],
  }
});

function gridCellClasses(index: number) {
  return [(index % 2) === 0 ? 'light-green' : 'green'].filter((i) => !!i);
}

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({type: '', id: '', children: undefined}),
});

const id = computed(function () {
  return modelValue.value.id;
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <n-grid v-if="children" class="grid" :x-gap="5" :y-gap="5" :cols="cols">
    <n-gi v-for="(i, index) in children" :key="i.id" class="grid-item">
      <div :class="gridCellClasses(index)">
        <!--gridColumn-->
        <GridColumnRendererItem v-model="children[index]"/>
      </div>
    </n-gi>
  </n-grid>
  <n-empty v-else description="栅格组件">
    <template #icon>
      <n-icon>
        <InboxOutlined/>
      </n-icon>
    </template>
  </n-empty>
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