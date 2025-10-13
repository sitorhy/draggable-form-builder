<script setup lang="ts">
import {type ComputedRef, inject} from 'vue';
import {ErrorCircle20Regular} from '@vicons/fluent';
import JsonRenderer from '../JsonRenderer.vue';
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);
</script>

<template>
  <a-button
      v-if="schema.props && schema.children"
      v-bind="{ ...schema.props, ...bindingProps }"
  >
    <JsonRenderer
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </a-button>
  <a-empty v-else description="Button">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
