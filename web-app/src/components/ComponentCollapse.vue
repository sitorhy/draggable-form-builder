<script setup lang="ts">
import {computed, ref} from "vue";
import ComponentTag from "./ComponentTag.vue";
import {useComponentsStore} from "../store.ts";
import {createRendererItemConfig} from "../common/renderer.ts";
import type {ComponentDefinition} from "../types";
import draggable from 'vuedraggable';

const store = useComponentsStore();
const groupIds = store.groups.map((i) => i.groupId);
const expandedNames = ref(groupIds);

const groups = computed(() => {
  return store.groups;
});

function clone(clonedData: ComponentDefinition) {
  return createRendererItemConfig(clonedData);
}
</script>

<template>
  <div class="component-collapse">
    <n-collapse :default-expanded-names="expandedNames">
      <n-collapse-item v-for="group in groups" :title="group.groupName" :name="group.groupId" :key="group.groupId">
        <draggable
            class="components-row"
            v-model="group.components"
            ghost-class="ghost"
            drag-class="drag"
            :sort="false"
            :clone="clone"
            :group="{ name: 'components', pull: 'clone' }"
            item-key="id">
          <template #item="{element: i}">
            <ComponentTag class="tag" :label="i.label"/>
          </template>
        </draggable>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped lang="scss">
.component-collapse {
  padding: 17px;
  height: 100%;
  box-sizing: border-box;
}

.components-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .tag {
    width: 48%;
    margin: 4px 0;
  }
}
</style>