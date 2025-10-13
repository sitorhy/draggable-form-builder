<script setup lang="ts">
import JsonRendererItem from './JsonRendererItem.vue';
import type { RendererItemDefinition } from 'engine-commons/types.ts';
import { type ComputedRef, inject } from 'vue';
import JsonRendererItemContainer from './JsonRendererItemContainer.vue';

defineOptions({
  name: 'JsonRenderer'
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({})
});
</script>

<template>
  <JsonRendererItem v-model:schema="schema">
    <div :class="['renderer-drop', schema.type]">
      <template
          v-if="schema.children"
          v-for="(_, index) in schema.children"
      >
        <JsonRendererItemContainer
            v-model:schema="schema.children[index]"
            :data-binding-path="bindingPath"
        >
          <JsonRenderer v-model:schema="schema.children[index]" />
        </JsonRendererItemContainer>
      </template>
    </div>
  </JsonRendererItem>
</template>
