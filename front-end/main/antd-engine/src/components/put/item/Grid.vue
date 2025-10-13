<script setup lang="ts">
import type {RendererItemDefinition} from 'engine-commons/types.ts';
import JsonRenderer from '../JsonRenderer.vue';

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

function gridItemStyle() {
  const cols = schema.value.props?.cols;
  const rows = schema.value.props?.rows;
  if (cols && rows) {
    return {
      flexBasis: `${parseInt(String((1 / cols) * 100))}%`,
    };
  }
}
</script>

<template>
  <div
      v-if="schema.children"
      class="grid"
  >
    <div class="grid-item" :style="gridItemStyle()" v-for="(cellSchema, index) in schema.children" :key="cellSchema.id">
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
