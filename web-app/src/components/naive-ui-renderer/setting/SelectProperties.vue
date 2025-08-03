<script setup lang="ts">
import {computed, type PropType, ref, watch} from "vue";
import {NInput, NSwitch, useMessage} from "naive-ui";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import DatasourceSelector from "./DatasourceSelector.vue";
import FunctionCodeSelector from "./FunctionCodeSelector.vue";
import {useDatasourceStore, useFunctionStore} from "../../../store.ts";

const datasourceStore = useDatasourceStore();
const functionStore = useFunctionStore();
const message = useMessage();

const feature = ref("");

const modelValue = defineModel('modelValue', {
  type: Object as PropType<RendererLayout>,
  default: () => ({
    props: {}
  }),
});

const props = computed({
  get: () => {
    if (modelValue.value.props) {
      return modelValue.value.props;
    }
    return {};
  },
  set: (value: any) => {
    modelValue.value.props = value;
  }
});

watch(() => JSON.stringify([props.value.datasource, props.value.functionCode]), async () => {
  const datasource = await datasourceStore.findDatasourceById(props.value.datasource);
  let handler = null;

  if (props.value.functionCode) {
    if (props.value.functionCode) {
      const module = await functionStore.loadModuleById(props.value.functionCode);
      console.log(module)
      handler = module.default;
    }
  }

  if (datasource) {
    if (datasource.isStatic) {
      try {
        let data = JSON.parse(datasource.mock);
        if (typeof handler === "function") {
          data = handler(data);
        }
        if (Array.isArray(data)) {
          modelValue.value.props = {
            ...modelValue.value.props,
            options: data,
          };
          return;
        }
      } catch (e) {
        console.error(e);
        message.error(e instanceof Error ? e.message : JSON.stringify(e));
      }
    } else {
      try {
        const response = await fetch(datasource.url as string, {
          method: datasource.method,
        });
        let data = await response.json();
        if (typeof handler === "function") {
          data = handler(data);
        }
        if (Array.isArray(data)) {
          modelValue.value.props = {
            ...modelValue.value.props,
            options: data,
          };
          return;
        }
      } catch (e) {
        console.error(e);
        message.error(e instanceof Error ? e.message : JSON.stringify(e));
      }
    }
  }
  modelValue.value.props = {
    ...modelValue.value.props,
    options: [],
  }
})

const schema = computed(function () {
  return [
    {
      type: NSwitch,
      prop: 'disabled',
      label: '禁用',
      config: {}
    },
    {
      type: NInput,
      prop: 'placeholder',
      label: "占位符",
      config: {
        placeholder: '',
      }
    },
    {
      type: 'slotScope',
      prop: 'datasource',
      label: '数据集',
    },
    {
      type: 'slotScope',
      prop: 'functionCode',
      label: '函数集',
    }
  ];
});
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="6em">
    <template #datasource>
      <DatasourceSelector :feature="feature" v-model:value="props.datasource"/>
    </template>
    <template #functionCode>
      <FunctionCodeSelector :feature="feature" v-model:value="props.functionCode"/>
    </template>
  </PropertiesForm>
</template>