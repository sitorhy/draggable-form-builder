<script setup lang="ts">
import JsonRenderer from "../JsonRenderer.vue";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";
import type {RendererItemDefinition} from "engine-commons/types.ts";
import type {ComputedRef} from "vue";
import {inject} from "vue";

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
  <button
      v-if="schema.props && schema.children"
      v-bind="{ ...schema.props, ...bindingProps }"
  >
    <JsonRenderer
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </button>
</template>
