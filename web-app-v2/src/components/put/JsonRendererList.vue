<script setup lang="ts">
import {computed} from "vue";
import BindingContext from "./data/BindingContext.vue";
import JsonRenderer from "./JsonRenderer.vue";
import draggable from "vuedraggable";

defineProps({
  pull: {
    // 继承上一级属性
    type: Boolean,
    default: true,
  },
  put: {
    // 继承上一级属性
    type: Boolean,
    default: true,
  }
});

const schema = defineModel('schema', {
  type: Object,
  default: () => ({type: '', id: '', children: undefined}),
});

const props = computed(function () {
  return schema.value.props ? schema.value.props : {
    dataSource: '', // 绑定数据源id，数据源返回数组
    loop: [] // 绑定静态数据，优先级高于数据源
  };
});

const loop = computed<any[]>(function () {
  return props.value.loop;
});

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
  return !evt.to.classList.contains(schema.value.type);
}

</script>

<template>
  <div class="renderer-drop linear-list" v-if="!loop || !loop.length">
    <!--占位-->
  </div>
  <BindingContext
      v-else
      v-for="(item, index) in loop"
      :bracket="true"
      :parse-number="true"
      :component-context="item"
      :path="`${index}`">
    <draggable v-if="schema.children"
               :class="['renderer-drop', schema.type, 'linear-list']"
               :group="{name: 'renderer-list', put: put, pull: pull}"
               :move="onMove"
               ghost-class="ghost"
               drag-class="drag"
               item-key="id"
               v-model="schema.children">
      <template #item="scope">
        <div>
          <JsonRenderer :pull="pull" :put="put" :type="schema.children[scope.index].type"
                        v-model:schema="schema.children[scope.index]"/>
        </div>
      </template>
    </draggable>
  </BindingContext>
</template>