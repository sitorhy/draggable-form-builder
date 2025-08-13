<script setup lang="ts">
import {computed} from "vue"
import draggable from "vuedraggable"
import JsonRendererItem from "./JsonRendererItem.vue";

defineOptions({
  name: 'JsonRenderer',
});

const props = defineProps({
  pull: {
    // 移出
    type: Boolean,
    default: true,
  },
  put: {
    // 移入
    type: Boolean,
    default: true,
  }
});

const group = computed(() => {
  return {
    name: 'renderer',
    put: props.put,
    pull: props.pull,
  }
});

const schema = defineModel('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});
</script>

<template>
  <!--占位元素 负责具体渲染渲染-->
  <JsonRendererItem :type="schema.type" v-model:schema="schema">
    <!-- 拖入区域 占位元素不提供插槽即不可拖入 -->
    <draggable v-if="schema.children"
               :class="['renderer-drop', schema.type]"
               :group="group"
               ghost-class="ghost"
               drag-class="drag"
               item-key="id"
               v-model="schema.children">
      <template #item="scope">
        <div>
          <JsonRenderer :pull="pull" :put="put" v-model:schema="schema.children[scope.index]"/>
        </div>
      </template>
    </draggable>
  </JsonRendererItem>
</template>

<style scoped>
.renderer-drop {
  --n-hegiht: 34px;
  min-height: var(--n-hegiht);

  &.page {
    width: 100%;
    height: 100%;
    background: #eee;
  }
}
</style>