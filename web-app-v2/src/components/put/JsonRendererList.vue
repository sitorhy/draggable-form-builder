<script setup lang="ts">
import JsonRendererItem from "./JsonRendererItem.vue";
import {computed} from "vue";
import BindingContext from "./data/BindingContext.vue";
import JsonRenderer from "./JsonRenderer.vue";
import draggable from "vuedraggable"

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
})

</script>

<template>
  <BindingContext v-for="(item, index) in loop"
                  :component-context="item"
                  :path="`[${index}]`">
    <draggable v-if="schema.children"
               :class="['renderer-drop', schema.type]"
               :group="{name: 'renderer', put: put, pull: pull}"
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

<style scoped lang="scss">

</style>