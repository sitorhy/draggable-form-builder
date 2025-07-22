<script setup lang="ts">
import {ref, computed} from 'vue';
import {NButton, NInput, NSelect, NSwitch} from "naive-ui";
import JsonEditorVue from 'json-editor-vue'
import PropertiesForm from "./PropertiesForm.vue";

defineProps({});

const formRef = ref();

const showModal = defineModel('modelValue', {
  type: Boolean,
  default: false,
});

const formData = ref({
  mock: "[]",
  url: "/",
  method: "GET",
  path: "",
  isStatic: false,
});

function getAllPaths(obj: any, currentPath: string = ''): string[] {
  const paths: string[] = [];
  if (typeof obj !== 'object' || obj === null) {
    if (currentPath !== '') {
      paths.push(currentPath);
    }
    return paths;
  }

  if (Array.isArray(obj)) {
    paths.push(currentPath);
    return paths;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newPath = currentPath === '' ? key : `${currentPath}.${key}`;
      const subPaths = getAllPaths(obj[key], newPath);
      paths.push(...subPaths);

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && subPaths.length === 0) {
        paths.push(newPath);
      }
    }
  }

  return paths;
}

const pathOptions = computed(() => {
  if (!formData.value.mock) {
    formData.value.path = "";
    return [];
  }
  const paths: string[] = getAllPaths(JSON.parse(formData.value.mock), '');
  return paths.map(i => ({label: i, value: i}));
});

const schema = computed(() => {
  return [
    {
      type: NSwitch,
      label: "静态数据",
      prop: "isStatic",
    },
    {
      visible: () => !formData.value.isStatic,
      type: NInput,
      prop: 'url',
      label: '请求地址',
      config: {
        placeholder: '',
        disabled: formData.value.isStatic,
      },
      rules: [
        {
          required: true,
          message: '请输入地址',
        }
      ]
    },
    {
      visible: () => !formData.value.isStatic,
      type: NSelect,
      label: "请求方法",
      prop: 'method',
      config: {
        disabled: true,
        options: [
          {
            value: 'GET',
            label: 'GET',
          },
          {
            value: 'POST',
            label: 'POST',
          }
        ]
      }
    },
    {
      type: NSelect,
      label: "集合路径",
      prop: 'path',
      config: {
        options: pathOptions.value,
        placeholder: "根路径",
        clearable: true,
      },
    },
    {
      type: 'slotScope',
      prop: 'mock',
      label: formData.value.isStatic ? '数据' : '模拟数据',
      rules: [
        {
          required: true,
          message: '请校验Mock数据',
        }
      ]
    }
  ];
});

function onPositiveClick() {
  if (formRef.value) {
    formRef.value.validate((errs?: Error[]) => {
      if (!errs) {

      }
    });
  }
}

function onNegativeClick() {
  showModal.value = false;
}
</script>

<template>
  <n-modal
      v-model:show="showModal"
      preset="card"
      :mask-closable="false"
      :style="{width: '800px'}"
      title="数据集"
      :bordered="false"
  >
    <PropertiesForm ref="formRef" :schema="schema" v-model="formData" label-width="6em">
      <template #mock>
        <JsonEditorVue
            class="json-editor"
            v-model="formData.mock"
            mode="text"
        />
      </template>
    </PropertiesForm>
    <template #footer>
      <n-button-group>
        <n-button @click="onPositiveClick" type="primary">确定</n-button>
        <n-button @click="onNegativeClick">取消</n-button>
      </n-button-group>
    </template>
  </n-modal>
</template>

<style scoped lang="scss">
.json-editor {
    width: 100%;
}
</style>