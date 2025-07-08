<script setup lang="ts">
import {type PropType} from "vue"
import GridRendererItem from "./GridRendererItem.vue";
import type {RendererLayout} from "../../types";
import {useRendererStore} from "../../store.ts";
import JsonRendererItemContainer from "./JsonRendererItemContainer.vue";
import TextInput from "./TextInput.vue";
import TextNumberInput from "./TextNumberInput.vue";
import DatePicker from "./DatePicker.vue";
import Select from "./Select.vue";
import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import EdgeInsets from "../common-renderer/EdgeInsets.vue";

const store = useRendererStore();

defineProps({
  type: {
    type: String,
    default: '',
  },
});

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({type: '', id: '', children: undefined}),
});

function cancelActiveComponent() {
  store.setActiveComponent("");
}
</script>

<template>
  <div :class="[type]">
    <slot v-if="type === 'root'" name="root">
      <div class="root" @click="cancelActiveComponent">
        <slot></slot>
      </div>
    </slot>
    <slot v-else-if="type === 'textInput'" name="textInput">
      <JsonRendererItemContainer>
        <template #default="scope">
          <TextInput v-model="modelValue" :ref="scope.childRef"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'textNumberInput'" name="textNumberInput">
      <JsonRendererItemContainer>
        <template #default="scope">
          <TextNumberInput :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'datePicker'" name="datePicker">
      <JsonRendererItemContainer>
        <template #default="scope">
          <DatePicker :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'select'" name="select">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Select :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'grid'" name="grid">
      <JsonRendererItemContainer>
        <template #default="scope">
          <GridRendererItem :ref="scope.childRef" v-model="modelValue" v-bind="modelValue.props"
                            :children="modelValue.children"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'form'" name="form">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Form :ref="scope.childRef" v-model="modelValue"></Form>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'formItem'" name="formItem">
      <JsonRendererItemContainer>
        <template #default="scope">
          <FormItem :ref="scope.childRef" v-model="modelValue"></FormItem>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'edgeInsets'" name="edgeInsets">
      <JsonRendererItemContainer>
        <template #default="scope">
          <EdgeInsets :ref="scope.childRef" v-model="modelValue"></EdgeInsets>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else name="default">
      <div>{{ type }}</div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.root {
  width: 100%;
  height: 100%;
  background: #eee;
}
</style>