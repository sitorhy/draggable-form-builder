<script setup lang="ts">
import {computed, ref} from "vue";
import ComponentTag from "./ComponentTag.vue";
import {createRendererItemConfig, useComponentsStore} from "../../store/component.ts";
import draggable from "vuedraggable";
import type {ComponentDefinition} from "../../types.ts";

const store = useComponentsStore();
const groupIds = store.groups.map((i) => i.groupId);
const expandedNames = ref(groupIds);

const groups = computed(() => {
  return store.groups;
});

function clone(clonedData: ComponentDefinition) {
  return createRendererItemConfig(clonedData);
}

function onMove(evt: CustomEvent & {
  from: HTMLElement;
  to: HTMLElement;
  draggedContext: {
    element: {
      type: string;
      label: string;
    },
    from: HTMLElement;
    to: HTMLElement;
    futureIndex: number;
    index: number;
  },
}) {
  return true;
}
</script>

<template>
  <n-collapse :default-expanded-names="expandedNames">
    <n-collapse-item v-for="group in groups" :title="group.groupName" :name="group.groupId" :key="group.groupId">
      <draggable
          class="components-row"
          v-model="group.components"
          ghost-class="ghost"
          drag-class="drag"
          :move="onMove"
          :sort="false"
          :clone="clone"
          :group="{ name: 'components', pull: 'clone', push: false, sort: false }"
          item-key="type">
        <template #item="scope">
          <ComponentTag class="tag" :type="scope.element.type" :label="scope.element.label"/>
        </template>
      </draggable>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="scss">
.components-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .tag {
    width: calc(50% - 4px);
  }
}
</style>