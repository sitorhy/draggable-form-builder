<script setup lang="ts">
import {computed} from "vue";
import TextInputProperties from "./naive-ui-renderer/setting/TextInputProperties.vue";
import {useRendererStore} from "../store.ts";
import {useRendererActions} from "../common/renderer.ts";
import TextNumberInputProperties from "./naive-ui-renderer/setting/TextNumberInputProperties.vue";
import DatePickerProperties from "./naive-ui-renderer/setting/DatePickerProperties.vue";
import SelectProperties from "./naive-ui-renderer/setting/SelectProperties.vue";
import GridProperties from "./naive-ui-renderer/setting/GridProperties.vue";
import FormProperties from "./naive-ui-renderer/setting/FormProperties.vue";
import FormItemProperties from "./naive-ui-renderer/setting/FormItemProperties.vue";
import ContainerProperties from "./naive-ui-renderer/setting/ContainerProperties.vue";
import CommonProperties from "./naive-ui-renderer/setting/CommonProperties.vue";
import CheckboxProperties from "./naive-ui-renderer/setting/CheckboxProperties.vue";
import CheckboxGroupProperties from "./naive-ui-renderer/setting/CheckboxGroupProperties.vue";

const store = useRendererStore();
const {findNodeById} = useRendererActions();

const rendererLayout = computed(function () {
  return findNodeById(store.activeRendererItemInfo.id);
});
</script>

<template>
  <div>
    <TextInputProperties v-if="rendererLayout?.type === 'textInput'" v-model="rendererLayout"/>
    <TextNumberInputProperties v-else-if="rendererLayout?.type === 'textNumberInput'" v-model="rendererLayout"/>
    <DatePickerProperties v-else-if="rendererLayout?.type === 'datePicker'" v-model="rendererLayout"/>
    <SelectProperties v-else-if="rendererLayout?.type === 'select'" v-model="rendererLayout"/>
    <GridProperties v-else-if="rendererLayout?.type === 'grid'" v-model="rendererLayout"/>
    <FormProperties v-else-if="rendererLayout?.type === 'form'" v-model="rendererLayout"/>
    <FormItemProperties v-else-if="rendererLayout?.type === 'formItem'" v-model="rendererLayout"/>
    <ContainerProperties v-else-if="rendererLayout?.type === 'container'" v-model="rendererLayout"/>
    <CheckboxGroupProperties v-else-if="rendererLayout?.type === 'checkboxGroup'" v-model="rendererLayout"/>
    <CheckboxProperties v-else-if="rendererLayout?.type === 'checkbox'" v-model="rendererLayout"/>
    <CommonProperties v-else :value="rendererLayout"/>
  </div>
</template>

<style scoped lang="scss">

</style>