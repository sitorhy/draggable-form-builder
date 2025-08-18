<script setup lang="ts">
import JsonRendererItem from "./JsonRendererItem.vue";
import {computed} from "vue";

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
  <div style="border: solid 2px greenyellow;">
    <JsonRendererItem v-for="(item, index) in loop" :pull="pull" :put="put" :type="schema.children[0].type"
                      v-model:schema="schema.children[0]"/>
  </div>
</template>

<style scoped lang="scss">

</style>