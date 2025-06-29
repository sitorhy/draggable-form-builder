<script setup lang="ts">
import {computed, ref} from "vue";
import TextInputProperties from "./naive-ui-renderer/setting/TextInputProperties.vue";
import {useRendererStore} from "../store.ts";
import {useRendererActions} from "../common/renderer.ts";
import TextNumberInputProperties from "./naive-ui-renderer/setting/TextNumberInputProperties.vue";
import DatePickerProperties from "./naive-ui-renderer/setting/DatePickerProperties.vue";
import SelectProperties from "./naive-ui-renderer/setting/SelectProperties.vue";

const expandedNames = ref(['1', '2']);

const store = useRendererStore();
const {findNodeById} = useRendererActions();

const rendererLayout = computed(function () {
  return findNodeById(store.activeRendererItemInfo.id);
});
</script>

<template>
  <n-collapse :default-expanded-names="expandedNames">
    <n-collapse-item title="属性" name="1">
      <TextInputProperties v-if="rendererLayout?.type === 'textInput'" v-model="rendererLayout"/>
      <TextNumberInputProperties v-else-if="rendererLayout?.type === 'textNumberInput'" v-model="rendererLayout"/>
      <DatePickerProperties v-else-if="rendererLayout?.type === 'datePicker'" v-model="rendererLayout"/>
      <SelectProperties v-else-if="rendererLayout?.type === 'select'" v-model="rendererLayout"/>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped lang="scss">

</style>