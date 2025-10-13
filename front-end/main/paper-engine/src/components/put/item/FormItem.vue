<script setup lang="ts">
import type {RendererItemDefinition} from "engine-commons/types.ts";
import JsonRenderer from "../JsonRenderer.vue";

defineOptions({
	name: 'FormItem'
});

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({ type: '', id: '', children: undefined })
});
</script>

<template>
  <div>
    <span>{{schema.props?.label}}</span>
    <JsonRenderer
        v-if="schema.children"
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </div>
</template>
