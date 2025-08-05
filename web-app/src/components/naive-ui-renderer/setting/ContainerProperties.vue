<script setup lang="ts">
import {computed, type PropType} from "vue";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import EdgeProperties from "./EdgeProperties.vue";
import {NSelect} from "naive-ui";

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

const schema = computed(function () {
  return [
    {
      type: 'slotScope',
      label: '内边距',
      prop: 'padding',
      config: {
        placeholder: '',
      }
    },
    {
      type: 'slotScope',
      label: '外边距',
      prop: 'margin',
      config: {
        placeholder: '',
      }
    },
    {
      type: NSelect,
      prop: 'display',
      label: '布局类型',
      config: {
        disabled: true,
        options: [
          {
            label: '弹性布局',
            value: 'flex',
          }
        ]
      }
    },
    {
      type: NSelect,
      prop: 'flexDirection',
      label: '主轴方向',
      config: {
        options: [
          {
            value: 'column',
            label: '垂直',
          },
          {
            value: 'row',
            label: '水平'
          }
        ]
      }
    },
    {
      type: NSelect,
      prop: 'justifyContent',
      label: '主轴对齐',
      config: {
        options: [
          {
            value: 'stretch',
            label: '拉伸',
          },
          {
            value: 'flex-start',
            label: '起点'
          },
          {
            value: 'flex-end',
            label: '终点'
          },
          {
            value: 'center',
            label: '居中'
          }
        ]
      }
    },
    {
      type: NSelect,
      prop: 'alignItems',
      label: '交叉轴对齐',
      config: {
        options: [
          {
            value: 'stretch',
            label: '拉伸',
          },
          {
            value: 'flex-start',
            label: '起点'
          },
          {
            value: 'flex-end',
            label: '终点'
          },
          {
            value: 'center',
            label: '居中'
          }
        ]
      }
    },
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props.style" label-width="6em">
    <template #padding>
      <EdgeProperties v-model:left="props.style.paddingLeft" v-model:right="props.style.paddingRight"
                      v-model:top="props.style.paddingTop" v-model:bottom="props.style.paddingBottom"/>
    </template>
    <template #margin>
      <EdgeProperties v-model:left="props.style.marginLeft" v-model:right="props.style.marginRight"
                      v-model:top="props.style.marginTop" v-model:bottom="props.style.marginBottom"/>
    </template>
  </PropertiesForm>
</template>