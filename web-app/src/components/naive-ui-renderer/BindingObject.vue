<script setup lang="ts">
import {computed, type PropType, ref, watch} from "vue";
import type {RendererLayout} from "../../types";
import {useDatasourceStore, useFunctionStore} from "../../store.ts";
import {createRendererItemConfig} from "../../common/renderer.ts";
import JsonRenderer from "./JsonRenderer.vue";

const functionStore = useFunctionStore();
const datasourceStore = useDatasourceStore();

const error = ref('');

function isPlainObject(obj: any) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = Object.getPrototypeOf(obj)
  if (proto === null) return true
  let baseProto = proto

  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto)
  }
  return proto === baseProto;
}

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

const transformProps = ref({});

const id = computed(function () {
  return modelValue.value.id;
});

const components = computed<{
  conditionCode: string;
  transformCode: string;
  datasource: string;
  component: string;
}[]>(() => {
  return props.value.components || [];
});

const currentComponentIndex = ref(-1);

watch(components, async (value) => {
  try {
    const conditions = value.map((i) => i.conditionCode);
    const datasource = value.map((i) => i.datasource);
    const trans = value.map((i) => i.transformCode);

    const data = await Promise.all(datasource.map((i) => datasourceStore.loadDatasourceById(i)));
    const conditionModules = await Promise.all(conditions.map((id: string) => functionStore.loadModuleById(id)));

    // 获取判断分支命中索引
    const validConditionIndex = conditionModules.findIndex((module, index) => {
      const fx = module.default;
      if (typeof fx === 'function') {
        return Boolean(fx(data[index]));
      }
      return false;
    });

    if (validConditionIndex >= 0) {
      currentComponentIndex.value = validConditionIndex;
      const transModules = await Promise.all(trans.map((id: string) => functionStore.loadModuleById(id)));
      const module = transModules[validConditionIndex];
      const fx = module.default;
      if (typeof fx === 'function') {
        const obj = fx(data[validConditionIndex]);
        if (isPlainObject(obj)) {
          transformProps.value = structuredClone(obj);
        } else {
          transformProps.value = {};
          currentComponentIndex.value = -1;
        }
      } else {
        transformProps.value = structuredClone(data[validConditionIndex]);
      }
      return;
    }

    currentComponentIndex.value = -1;
    transformProps.value = {};
  } catch (e) {
    currentComponentIndex.value = -1;
    error.value = e instanceof Error ? e.message : JSON.stringify(e);
  }
}, {
  immediate: true,
  deep: true,
});

watch([transformProps, currentComponentIndex], () => {
  try {
    if (currentComponentIndex.value < 0) {
      return modelValue.value.children = [];
    }
    const validConditionConfig = components.value[currentComponentIndex.value];
    modelValue.value.children = [
      createRendererItemConfig({
        type: validConditionConfig.component,
        props: {
          ...transformProps.value
        },
      })
    ];
    error.value = '';
  } catch (e) {
    error.value = e instanceof Error ? e.message : JSON.stringify(e);
  }
}, {
  deep: true,
});

defineExpose({
  id: id.value,
});
</script>

<template>
  <div class="binding-object">
    <n-alert v-if="error" title="Error" type="error">
      {{ error }}
    </n-alert>
    <JsonRenderer v-else-if="modelValue && modelValue.children && modelValue.children.length"
                  v-model="modelValue.children[0]"/>
  </div>
</template>

<style scoped lang="scss">
.binding-object {
  --n-hegiht: 34px;
  min-height: var(--n-hegiht);

  border-style: dashed;
  border-width: 1px;
  box-sizing: border-box;

  &:hover {
    background-color: rgba(0, 128, 0, 0.12);
  }
}
</style>