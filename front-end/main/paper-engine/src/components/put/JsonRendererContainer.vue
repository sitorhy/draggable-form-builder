<script setup lang="ts">
import JsonRenderer from './JsonRenderer.vue';
import type {RendererItemDefinition} from '../../types.ts';
import {computed, type ComputedRef, inject} from 'vue';

defineOptions({
  name: 'JsonRendererContainer'
});

defineProps({
  tag: {
    type: String,
    default: 'div'
  }
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

const style = computed(() => {
  return schema.value.props?.style;
});
</script>

<template>
  <div
      class="container"
      v-if="schema.children"
      :data-binding-path="bindingPath"
      :style="style"
  >
    <JsonRenderer v-for="(_, index) in schema.children" v-model:schema="schema.children[index]"/>
  </div>
</template>