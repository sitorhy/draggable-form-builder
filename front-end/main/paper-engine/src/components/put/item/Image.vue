<script setup lang="ts">
import type {RendererItemDefinition} from '../../../types.ts';

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

</script>

<template>
  <img
      alt="" src=""
      v-if="schema.props"
      v-bind="schema?.props"
  />
</template>
