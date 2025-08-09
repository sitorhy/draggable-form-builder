<script setup lang="ts">
import {computed, type PropType, ref} from "vue";
import PropertiesForm from "../../PropertiesForm.vue";
import type {RendererLayout} from "../../../types";
import FunctionCodeSelector from "./FunctionCodeSelector.vue";
import {
  AddCircle24Regular,
  ArrowCircleUp24Regular,
  ArrowCircleDown24Regular
} from '@vicons/fluent';
import {NButton, NIcon} from "naive-ui";
import DatasourceSelector from "./DatasourceSelector.vue";

const showAddModal = ref(false);
const formData = ref({
  conditionCode: null,
  datasource: null,
  component: null,
  transformCode: null,
});
const formRef = ref();
const rules = ref(
    {
      conditionCode: [
        {
          required: true,
          message: '选择函数集'
        }
      ],
      datasource: [
        {
          required: true,
          message: '选择数据集'
        }
      ],
      component: [
        {
          required: true,
          message: '选择组件'
        }
      ]
    }
);

const componentOptions = ref([
  {
    label: '图片',
    value: 'image',
  },
  {
    label: '文本输入',
    value: 'textInput',
  },
  {
    label: '数字输入',
    value: 'textNumberInput',
  },
  {
    label: '日期选择器',
    value: 'datePicker',
  },
  {
    label: '选择器',
    value: 'select',
  },
  {
    label: '单选框',
    value: 'radioGroup',
  },
  {
    label: '复选框',
    value: 'checkboxGroup',
  }
]);

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
      prop: 'components',
      label: '',
      config: {},
    }
  ];
});

function onAdd() {
  formData.value = {
    conditionCode: null,
    datasource: null,
    component: null,
    transformCode: null,
  };
  showAddModal.value = !showAddModal.value;
}

function onMoveUp(index: number) {
  const item = props.value.components[index];
  props.value.components.splice(index, 1);
  props.value.components.splice(index - 1, 0, item);
}

function onMoveDown(index: number) {
  const item = props.value.components[index];
  props.value.components.splice(index, 1);
  props.value.components.splice(index + 1, 0, item);
}

function onNegativeClick() {
  showAddModal.value = false;
}

function onPositiveClick() {
  if (formRef.value.validate()) {
    if (!Array.isArray(props.value.components)) {
      props.value.components = [];
    }
    props.value.components.push({
      ...formData.value,
    });
    showAddModal.value = false;
  }
}
</script>

<template>
  <PropertiesForm :schema="schema" v-model="props" label-width="3em">
    <template #components>
      <n-list :hoverable="true" :show-divider="true" style="width: 100%;">
        <template #header>
          <n-button @click="onAdd" type="primary">
            <template #icon>
              <n-icon>
                <AddCircle24Regular/>
              </n-icon>
            </template>
            <span>渲染条件</span>
          </n-button>
        </template>

        <n-list-item v-for="(item, index) in props?.components || []">
          <div>
            <n-space vertical>
              <div>
                <span>条件</span>
                <FunctionCodeSelector :clearable="false" placeholder="" feature="other"
                                      v-model:value="item.conditionCode"/>
              </div>
              <div>
                <span>模型</span>
                <DatasourceSelector :clearable="false" placeholder="" feature="other" v-model:value="item.datasource"/>
              </div>
              <div>
                <span>转换</span>
                <FunctionCodeSelector :clearable="false" placeholder="" feature="other"
                                      v-model:value="item.transformCode"/>
              </div>
              <div>
                <span>组件</span>
                <n-select :clearable="false" placeholder="" v-model:value="item.component"
                          :options="componentOptions"></n-select>
              </div>
            </n-space>
          </div>

          <template #suffix>
            <n-space vertical v-if="props.components && props.components.length">
              <n-button v-if="index > 0" circle @click="() => onMoveUp(index)" type="primary">
                <template #icon>
                  <n-icon>
                    <ArrowCircleUp24Regular/>
                  </n-icon>
                </template>
              </n-button>

              <n-button v-if="index < props.components.length - 1" circle @click="() => onMoveDown(index)"
                        type="primary">
                <template #icon>
                  <n-icon>
                    <ArrowCircleDown24Regular/>
                  </n-icon>
                </template>
              </n-button>
            </n-space>
          </template>
        </n-list-item>
      </n-list>
    </template>
  </PropertiesForm>

  <n-modal v-model:show="showAddModal">
    <n-card
        style="width: 50%"
        title="添加条件"
        :bordered="false"
        role="dialog"
        aria-modal="true"
    >
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item path="conditionCode" label="渲染判定函数">
          <FunctionCodeSelector :clearable="false" placeholder="函数需返回布尔值" feature="other"
                                v-model:value="formData.conditionCode"/>
        </n-form-item>
        <n-form-item path="datasource" label="模拟数据">
          <DatasourceSelector :clearable="false" placeholder="数据格式" feature="other"
                              v-model:value="formData.datasource"/>
        </n-form-item>
        <n-form-item path="transformCode" label="格式转换函数">
          <FunctionCodeSelector :clearable="false" placeholder="数据格式适配，不指定则直接传递" feature="other"
                                v-model:value="formData.transformCode"/>
        </n-form-item>
        <n-form-item path="component" label="渲染组件">
          <n-select :clearable="false" placeholder="条件符合时渲染" v-model:value="formData.component"
                    :options="componentOptions"></n-select>
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button-group>
          <n-button @click="onPositiveClick" type="primary">确定</n-button>
          <n-button @click="onNegativeClick">取消</n-button>
        </n-button-group>
      </template>
    </n-card>
  </n-modal>
</template>