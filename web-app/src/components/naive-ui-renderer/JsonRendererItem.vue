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
import Container from "./Container.vue";
import CheckboxGroup from "./CheckboxGroup.vue";
import Checkbox from "./Checkbox.vue";
import RadioGroup from "./RadioGroup.vue";
import Radio from "./Radio.vue";
import Button from "./Button.vue";
import Text from "./Text.vue";
import Image from "./Image.vue";
import BindingScope from "./BindingScope.vue";
import BindingObject from "./BindingObject.vue";

const store = useRendererStore();

defineProps({
  type: {
    type: String,
    default: '',
  },
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
          <BindingScope :id="modelValue.id">
            <TextInput v-model="modelValue" :ref="scope.childRef"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'textNumberInput'" name="textNumberInput">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id">
            <TextNumberInput :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'datePicker'" name="datePicker">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id">
            <DatePicker :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'select'" name="select">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id">
            <Select :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'grid'" name="grid">
      <JsonRendererItemContainer>
        <template #default="scope">
          <GridRendererItem :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue" v-bind="modelValue.props"
                            :children="modelValue.children"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'form'" name="form">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :default-value="{}" :id="modelValue.id">
            <Form :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue"></Form>
          </BindingScope>
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
    <slot v-else-if="type === 'container'" name="container">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Container :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue"></Container>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'checkboxGroup'" name="checkboxGroup">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id">
            <CheckboxGroup :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'checkbox'" name="checkbox">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Checkbox :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'radioGroup'" name="radioGroup">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id">
            <RadioGroup :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'radio'" name="radio">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Radio :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'button'" name="button">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Button :put="put" :pull="pull" :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'text'" name="text">
      <JsonRendererItemContainer>
        <template #default="scope">
          <Text :ref="scope.childRef" v-model="modelValue"/>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'image'" name="image">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingScope :id="modelValue.id" :default-value="''">
            <Image :ref="scope.childRef" v-model="modelValue"/>
          </BindingScope>
        </template>
      </JsonRendererItemContainer>
    </slot>
    <slot v-else-if="type === 'bindingObject'" name="bindingObject">
      <JsonRendererItemContainer>
        <template #default="scope">
          <BindingObject :ref="scope.childRef" v-model="modelValue"></BindingObject>
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