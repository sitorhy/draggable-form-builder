<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import type { RendererItemDefinition } from '../../../types.ts';
import { useEmptyPropsInjection } from '../common/props.ts';
import {KatexVue} from "katex-vue";

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

const katexText = computed(() => {
  return propsReduce.value.katex || '';
});

const style = computed(() => {
  return propsReduce.value.style || {};
});

defineExpose({
  id: id.value
});
</script>

<template>
  <div
      class="equation-container"
      :style="style"
      v-if="schema.props"
  >
    <katex-vue :expression="katexText" displayMode/>
  </div>
</template>


<style lang="scss" scoped>
.equation-container {
  display: inline-block;
  height: fit-content;
}
</style>
