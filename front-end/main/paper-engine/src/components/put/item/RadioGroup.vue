<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import type { RendererItemDefinition } from 'engine-commons/types.ts';
import { useEmptyPropsInjection } from 'engine-commons/components/put/common/props.ts';
import JsonRenderer from '../JsonRenderer.vue';


const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({ type: '', id: '', children: undefined })
});

const id = computed(function () {
  return schema.value.id;
});

const { emptyPropsInjection } = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const propsReduce = computed(() => ({
  ...schema.value.props,
  ...bindingProps.value
}));

defineExpose({
  id: id.value
});
</script>

<template>
  <div
      class="renderer-item-container"
      v-if="schema.props && schema.children"
      v-bind="propsReduce"
  >
    <JsonRenderer
        v-for="(containerSchema, index) in schema.children"
        :key="containerSchema.id"
        v-model:schema="schema.children[index]"
    />
  </div>
</template>
