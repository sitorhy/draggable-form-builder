<script setup lang="ts">
import type {RendererItemDefinition} from 'engine-commons/types.ts';
import JsonRenderer from '../JsonRenderer.vue';
import type {StyleValue} from "vue";

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

function gridItemStyle(index: number) {
  const cols = schema.value.props?.cols;
  const rows = schema.value.props?.rows;
  const xGap = schema.value.props?.xGap;
  const yGap = schema.value.props?.yGap;

  if (cols && rows) {
    return {
      flexBasis: `${parseInt(String((1 / cols) * 100))}%`,
      paddingTop: index === 0 ? 0 : `${yGap}px`,
      paddingBottom: index === rows - 1 ? 0 : `${yGap}px`,
      paddingRight: index % cols === cols - 1 ? 0 : `${xGap}px`,
      paddingLeft: index % cols === 0 ? 0 : `${xGap}px`,
      boxSizing: 'border-box',
    } as StyleValue;
  }
  return {};
}
</script>

<template>
  <div
      v-if="schema.children"
      class="grid"
  >
    <div class="grid-item" :style="gridItemStyle(index)" v-for="(cellSchema, index) in schema.children"
         :key="cellSchema.id">
      <JsonRenderer v-model:schema="schema.children[index]"/>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.grid .grid-item {
  flex: 1;
}
</style>
