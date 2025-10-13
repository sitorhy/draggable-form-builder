<script setup lang="ts">
import JsonRenderer from '../JsonRenderer.vue';
import type {RendererItemDefinition} from "engine-commons/types.ts";

const slots = defineModel<Record<string, RendererItemDefinition>>('slots', {
	default: () => ({})
});
</script>

<template>
	<a-list-item>
    <a-list-item-meta>
      <template v-if="slots.suffix" #title>
        <JsonRenderer v-model:schema="slots.prefix" />
      </template>
      <template v-if="slots.prefix" #avatar>
        <JsonRenderer v-model:schema="slots.suffix" />
      </template>
      <template #description>
        <slot></slot>
      </template>
    </a-list-item-meta>
	</a-list-item>
</template>
