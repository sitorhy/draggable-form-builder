<script setup lang="ts">
import {computed, type ComputedRef, inject} from 'vue';
import {PAGE_FORMAT} from '../common/constants.ts';
import type {RendererItemDefinition} from '../../../types.ts';
import draggable from 'vuedraggable';
import JsonRendererItemContainer from "../JsonRendererItemContainer.vue";
import JsonRenderer from "../JsonRenderer.vue";

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

const containerClasses = computed(function () {
  return [
    'renderer-drop',
    'draggable-placeholder',
    schema.value.type,
    !schema.value.children?.length ? 'placeholder-width' : ''
  ];
});

const bindingPath = inject<ComputedRef<string>>('bindingPath');

const pageStyle = computed(() => {
  const style: Record<string, any> = {
    ...dimension.value
  };

  if (props.value.background) {
    style.background = props.value.background;
  }

  if (props.value.padding) {
    style.padding = props.value.padding;
  }

  return style;
});

function containerDragMove() {
  return false;
}
</script>

<template>
  <div
      v-emphasize:schemaId="schema.id"
      :style="pageStyle"
      :id="schema.id"
  >
    <draggable
        v-if="schema.children"
        :class="containerClasses"
        :move="containerDragMove"
        :group="{ name: 'renderer-container', put: true, pull: true }"
        :data-binding-path="bindingPath"
        :style="schema.props?.style"
        item-key="id"
        ghost-class="ghost"
        drag-class="drag"
        v-model="schema.children"
    >
      <template #item="scope">
        <JsonRendererItemContainer v-model:schema="schema.children[scope.index]">
          <JsonRenderer v-model:schema="schema.children[scope.index]"/>
        </JsonRendererItemContainer>
      </template>
    </draggable>
  </div>
</template>
