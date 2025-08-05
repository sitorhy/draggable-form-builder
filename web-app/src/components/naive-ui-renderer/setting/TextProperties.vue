<script setup lang="ts">
import {computed, type PropType, ref, onMounted} from "vue";
import {NInput, NSelect} from "naive-ui";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import SizePropertyInput from "./SizePropertyInput.vue";

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

async function getLocalFonts() {
  /*
  if ("queryLocalFonts" in window) {
    try {
      const availableFonts = await (window as any).queryLocalFonts();
      if (!availableFonts.length) {
        return [];
      }
      return availableFonts;
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject("浏览器版本太低 or 网站不安全");
  }*/

  return [
    {
      fullName: "Times New Roman",
      postscriptName: "Times New Roman",
    },
    {
      fullName: "system-ui",
      postscriptName: "system-ui",
    },
    {
      fullName: "微软雅黑",
      postscriptName: "微软雅黑",
    },
    {
      fullName: "宋体",
      postscriptName: "宋体",
    },
    {
      fullName: "黑体",
      postscriptName: "黑体",
    },
    {
      fullName: "楷体",
      postscriptName: "楷体",
    },
    {
      fullName: "仿宋",
      postscriptName: "仿宋",
    }
  ];
}

const fontFamilies = ref<{
  label: string;
  value: string;
}[]>([]);

onMounted(async () => {
  fontFamilies.value = (await getLocalFonts()).map(i => {
    return {
      label: i.postscriptName,
      value: i.fullName
    };
  });
});

const props = computed(() => {
  if (modelValue.value.props) {
    return modelValue.value.props;
  }
  return {
    style: {}
  };
});

const style = computed(() => {
  return props.value.style;
});

const schema = computed(function () {
  return [
    {
      type: NSelect,
      prop: 'tag',
      label: '标签',
      config: {
        options: [
          {
            label: 'span',
            value: 'span'
          },
          {
            label: 'p',
            value: 'p'
          },
          {
            label: 'h1',
            value: 'h1'
          },
          {
            label: 'h2',
            value: 'h2'
          },
          {
            label: 'h3',
            value: 'h3'
          },
          {
            label: 'h4',
            value: 'h4'
          },
          {
            label: 'h5',
            value: 'h5'
          },
          {
            label: 'h6',
            value: 'h6'
          }
        ]
      }
    },
    {
      type: NInput,
      prop: 'text',
      label: '文本',
    },
    {
      type: 'slotScope',
      prop: 'fontSize',
      label: '字号',
    },
    {
      type: 'slotScope',
      prop: 'fontFamily',
      label: '字体',
    },
    {
      type: 'slotScope',
      prop: 'fontWeight',
      label: '加粗',
    },
    {
      type: 'slotScope',
      prop: 'fontStyle',
      label: '斜体',
    },
    {
      type: 'slotScope',
      prop: 'color',
      label: '颜色',
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="3em">
    <template #fontSize>
      <SizePropertyInput v-model="style.fontSize" :bordered="true" size="medium" :show-button="true" width="100%"/>
    </template>
    <template #fontFamily>
      <n-select :options="fontFamilies" :value="style.fontFamily" @update:value="(value) => style.fontFamily = value"/>
    </template>
    <template #fontWeight>
      <n-switch :value="style.fontWeight === 'bold'" @update:value="(value: boolean) => style.fontWeight = value ? 'bold' : 'normal'"/>
    </template>
    <template #fontStyle>
      <n-switch :value="style.fontStyle === 'italic'" @update:value="(value: boolean) => style.fontStyle = value ? 'italic' : 'normal'"/>
    </template>
    <template #color>
      <n-color-picker :value="style.color" @update:value="(value: string) => style.color = value"/>
    </template>
  </PropertiesForm>
</template>