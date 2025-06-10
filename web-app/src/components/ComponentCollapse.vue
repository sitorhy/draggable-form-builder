<script setup lang="ts">
import {computed, ref} from "vue";
import ComponentTag from "./ComponentTag.vue";
import {useComponentsStore} from "../store.ts";
import {type UseDraggableReturn, VueDraggable} from 'vue-draggable-plus';
import {v4 as uuid} from 'uuid';

const store = useComponentsStore();
const groupIds = store.groups.map((i) => i.groupId);
const expandedNames = ref(groupIds);

const groups = computed(() => {
  return store.groups;
});

const el = ref<UseDraggableReturn>();

function clone(clonedData: Record<string, any>) {
  return {
    id: uuid(),
    ...clonedData,
  }
}
</script>

<template>
  <div class="component-collapse">
    <n-collapse :default-expanded-names="expandedNames">
      <n-collapse-item v-for="group in groups" :title="group.groupName" :name="group.groupId" :key="group.groupId">
        <VueDraggable
            ref="el"
            ghost-class="ghost"
            drag-class="drag"
            :clone="clone"
            class="components-row"
            v-model="group.components"
            :group="{ name: 'components', pull: 'clone' }"
            :sort="false"
        >
          <ComponentTag class="tag" v-for="i in group.components" :key="i.type" :label="i.label"></ComponentTag>
        </VueDraggable>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped lang="scss">
.component-collapse {
  padding: 17px;
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