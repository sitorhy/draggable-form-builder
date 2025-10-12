<script setup lang="ts">
import {computed, type ComputedRef, inject, onBeforeMount, onMounted} from 'vue';
import {PAGE_FORMAT} from 'engine-commons/components/put/common/constants.ts';
import type {RendererItemDefinition} from 'engine-commons/types.ts';
import {useEmptyPropsInjection} from "engine-commons/components/put/common/props.ts";

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({})
});

type PageProps = {
  path: string;
  format: string;
  direction: string;
  background: string;
  padding: string;
};

const props = computed<PageProps>(() => schema.value.props as PageProps);

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const dimension = computed(() => {
  if (props.value.format) {
    const format = PAGE_FORMAT.find((i) => i.value === props.value.format);
    if (format) {
      if (format.size && props.value.direction === 'landscape') {
        return {
          width: format.size.height,
          height: format.size.width,
          minHeight: format.size.minHeight || '34px',
          margin: 'auto',
          boxSizing: 'border-box'
        };
      }
      return {
        ...format.size,
        margin: 'auto',
        boxSizing: 'border-box'
      };
    }
  }

  return {
    width: '100%',
    height: 'fit-content',
    minHeight: '34px',
    boxSizing: 'border-box'
  };
});

const pageStyle = computed(() => {
  const style: Record<string, any> = {
    ...dimension.value
  };

  if (props.value.padding) {
    style.padding = props.value.padding;
  }

  return style;
});

onBeforeMount(() => {
  if (typeof bindingProps.value.onBeforeMount === 'function') {
    bindingProps.value.onBeforeMount();
  }
});

onMounted(() => {
  if (typeof bindingProps.value.onMounted === 'function') {
    bindingProps.value.onMounted();
  }
});
</script>

<template>
  <div
      class="page-preview-border"
      :style="pageStyle"
      :id="schema.id"
  >
    <slot></slot>
  </div>
</template>

<style>
.page-preview-border {
  border: solid 1px grey;
}
</style>
