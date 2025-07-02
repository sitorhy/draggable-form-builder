<script setup lang="ts">
import {computed, type PropType} from "vue";
import {NInputNumber} from "naive-ui";
import PropertiesForm from "./PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import {v4 as uuid} from "uuid";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const props = computed(() => {
  if (modelValue.value.props) {
    return modelValue.value.props;
  }
  return {};
});

function updateCells() {
  console.log(props.value);
  if (!props.value.cols) {
    props.value.cols = 1;
  }
  if (!props.value.rows) {
    props.value.rows = 1;
  }
  const size = props.value.cols * props.value.rows;
  console.log(size);
  if (Number.isSafeInteger(size)) {
    if (!modelValue.value.children) {
      modelValue.value.children = [];
    }
    while (modelValue.value.children.length < size) {
      modelValue.value.children.push({
        type: "gridCell",
        id: uuid(),
        children: [],
        props: {},
      });
    }
    if (modelValue.value.children.length > size) {
      const removeSection = modelValue.value.children.slice(size);
      const cellChildren = removeSection.reduce((s: RendererLayout[], i) => {
        if (Array.isArray(i.children) && i.children.length > 0) {
          return [...s, ...i.children];
        }
        return s;
      }, []);
      modelValue.value.children.splice(size, modelValue.value.children.length - size + 1);
      if (modelValue.value.children.length > 0) {
        const lastChild = modelValue.value.children[modelValue.value.children.length - 1];
        if (lastChild) {
          if (!lastChild.children) {
            lastChild.children = [];
          }
          lastChild.children.push(...cellChildren);
        }
      }
    }
  }
}

const schema = computed(function () {
  return [
    {
      type: NInputNumber,
      prop: 'cols',
      label: '列数',
      config: {
        placeholder: '',
        min: 1,
        max: 100,
      },
      on: {
        'update:value': function (cols: number) {
          props.value.cols = cols;
          updateCells();
        }
      }
    },
    {
      type: NInputNumber,
      prop: 'rows',
      label: '行数',
      config: {
        placeholder: '',
        min: 1,
        max: 100,
      },
      on: {
        'update:value': function (rows: number) {
          props.value.rows = rows;
          updateCells();
        }
      }
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em"/>
</template>

<style scoped lang="scss">

</style>