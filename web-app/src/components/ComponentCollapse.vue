<script setup lang="ts">
import {computed, ref} from "vue";
import ComponentTag from "./ComponentTag.vue";
import {useComponentsStore} from "../store.ts";
import {createRendererItemConfig, useRendererMessage} from "../common/renderer.ts";
import type {ComponentDefinition, RuleParams} from "../types";
import draggable from "vuedraggable"
import DragRules from "../common/rules.ts";

const store = useComponentsStore();
const groupIds = store.groups.map((i) => i.groupId);
const expandedNames = ref(groupIds);
const {showMessage} = useRendererMessage();

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
  if (evt.from.classList.contains("components-row")) {
    if (evt.to.classList.contains("components-row")) {
      return false;
    }
  }
  const rule = DragRules[evt.draggedContext.element.type];
  if (typeof rule === "function") {
    const params: RuleParams = {
      from: evt.from,
      fromClassList: Array.of(...evt.from.classList),
      toClassList: Array.of(...evt.to.classList),
      to: evt.to,
      fromIndex: evt.draggedContext.index,
      toIndex: evt.draggedContext.futureIndex,
    };
    try {
      return rule(params);
    } catch (e) {
      showMessage(e instanceof Error ? e.message : JSON.stringify(e));
      return false;
    }
  }
  return true;
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