<script setup lang="ts">
import {computed, type ComputedRef, inject, provide} from 'vue';
import {ErrorCircle20Regular} from '@vicons/fluent';
import JsonRenderer from '../JsonRenderer.vue';
import type {RendererItemDefinition} from "engine-commons/types.ts";
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";

defineOptions({
  name: 'FormItem'
});

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined})
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const propsReduce = computed(() => ({
  ...schema.value.props,
  ...bindingProps.value,
}));

const propsCombined = computed(() => ({
  ...propsReduce.value,
  name: propsReduce.value.path,
  validateFirst: propsReduce.value.first
}))

provide('formItemBindingPath', bindingPath);
</script>

<template>
  <a-form-item
      v-if="schema.props && schema.children"
      v-bind="propsCombined"
  >
    <JsonRenderer
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </a-form-item>
  <a-empty v-else description="FormItem">
    <template #description>
      <ErrorCircle20Regular/>
    </template>
  </a-empty>
</template>
