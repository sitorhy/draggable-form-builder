<script setup lang="ts">
import {ref, computed, type PropType} from 'vue';
import {NButton, NInput, NSelect, NSwitch, useMessage} from "naive-ui";
import JsonEditorVue from 'json-editor-vue'
import PropertiesForm from "./PropertiesForm.vue";
import {useDatasourceStore} from '../store.ts';
import type {Datasource} from "../types";
import {FeatureTypes} from "../common/renderer.ts";

defineProps({});

const emit = defineEmits(['success']);

const datasourceStore = useDatasourceStore();
const message = useMessage();

const formRef = ref();

const showModal = defineModel('modelValue', {
  type: Boolean,
  default: false,
});

const formData = defineModel('formData', {
  type: Object as PropType<Partial<Datasource>>,
  default: () => ({
    isStatic: false,
  }),
});

const schema = computed(() => {
  return [
    {
      type: NSwitch,
      label: "静态数据",
      prop: "isStatic",
      span: 4,
    },
    {
      type: NInput,
      label: '名称',
      prop: "name",
      config: {
        placeholder: '',
      },
      rules: [
        {
          required: true,
          message: '数据集名称',
        }
      ]
    },
    {
      prop: 'description',
      label: '描述',
      type: NInput,
      config: {
        placeholder: '数据集用途描述',
      },
      rules: [
        {
          required: false,
          message: '数据集用途描述',
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
        placeholder: '',
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
      },
      rules: [
        {
          required: true,
          message: '选择请求方法',
        }
      ]
    },
    {
      type: NSelect,
      label: "功能类别",
      prop: 'feature',
      config: {
        disabled: false,
        placeholder: '',
        options: FeatureTypes,
      },
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
      ],
      span: 4,
    },
    {
      type: 'slotScope',
      prop: 'mock',
      label: formData.value.isStatic ? '数据' : '模拟数据',
      rules: [
        {
          required: true,
          message: formData.value.isStatic ? '请校验数据' : '请校验Mock数据',
        }
      ],
      span: 4,
    }
  ];
});

function onPositiveClick() {
  if (formRef.value) {
    formRef.value.validate(async (errs?: Error[]) => {
      if (!errs) {
        try {
          if (formData.value.id) {
            await datasourceStore.updateDatasource(formData.value);
            message.success('数据集已更新');
          } else {
            await datasourceStore.createDatasource(formData.value);
            message.success('数据集已创建');
          }
          emit('success');
        } catch (e) {
          message.error((e as Error).message);
          return;
        }
        showModal.value = false;
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
      :style="{width: '68%'}"
      title="数据集"
      :bordered="false"
  >
    <PropertiesForm ref="formRef" :cols="2" :schema="schema" v-model="formData" label-width="6em">
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