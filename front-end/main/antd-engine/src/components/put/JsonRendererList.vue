<script setup lang="ts">
import {computed, type ComputedRef, inject, type PropType} from 'vue';
import BindingContext from 'engine-commons/components/put/data/BindingContext.vue';
import JsonRenderer from './JsonRenderer.vue';
import type {RendererItemDefinition} from 'engine-commons/types.ts';
import {joinPathConfig, getCurrentPathConfig} from 'engine-commons/components/put/common/binding-path.ts';
import {useEmptyPropsInjection} from 'engine-commons/components/put/common/props.ts';

defineOptions({
  name: 'JsonRendererList'
});

defineProps({
  tag: {
    // 容器组件
    type: String,
    default: 'div'
  },
  pull: {
    type: Boolean,
    default: true
  },
  put: {
    type: Boolean,
    default: true
  },
  componentData: {
    // 附加属性（DOM） / 容器组件Props（Custom Component）
    type: Object,
    default: () => ({})
  },
  loop: {
    type: Array as PropType<Record<string, any>>,
    default: () => []
  }
});

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({})
});

const {emptyPropsInjection} = useEmptyPropsInjection();
const bindingProps = inject<ComputedRef<Record<string, any>>>(
    'bindingProps',
    emptyPropsInjection
);

const propsReduce = computed(() => ({
  ...schema.value.props,
  ...bindingProps.value
}));

const bindingPath = inject<ComputedRef<string>>('bindingPath');

function createItemBindingPath(index: number) {
  return (
      bindingPath?.value +
      joinPathConfig([
        getCurrentPathConfig({
          bracket: true,
          path: String(index),
          parseNumber: true
        })
      ])
  );
}
</script>

<template>
  <BindingContext
      v-for="(item, index) in propsReduce.loop"
      :schema="schema"
      :key="createItemBindingPath(index)"
      :bracket="true"
      :parse-number="true"
      :component-context="item"
      :custom-path="`${index}`"
  >
    <component class="renderer-item-contents" :is="tag" v-if="schema.children" v-for="(_, i) in schema.children">
      <JsonRenderer v-model:schema="schema.children[i]"/>
    </component>
  </BindingContext>
</template>
