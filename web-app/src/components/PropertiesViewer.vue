<script setup lang="ts">
import {computed, ref} from "vue";
import TextInputProperties from "./naive-ui-renderer/setting/TextInputProperties.vue";
import {useRendererStore} from "../store.ts";
import {useRendererActions} from "../common/renderer.ts";

const expandedNames = ref(['1', '2']);

const store = useRendererStore();
const {findNodeById} = useRendererActions();

const rendererLayout = computed(function () {
  return findNodeById(store.activeRendererItemInfo.id);
});

const props = ref({});
</script>

<template>
  <n-collapse :default-expanded-names="expandedNames">
    <n-collapse-item title="属性" name="1">
      <TextInputProperties v-if="rendererLayout?.type === 'textInput'" v-model="rendererLayout.props"/>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="scss">

</style>