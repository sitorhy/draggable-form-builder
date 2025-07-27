<script setup lang="ts">
import {h, watch} from "vue";
import {ref, computed} from 'vue';
import {NButton} from "naive-ui";
import {useFunctionStore} from '../store.ts';
import type {Datasource, FunctionCode} from "../types";
import FunctionCodeDialog from './FunctionCodeDialog.vue';
import {FeatureTypes} from "../common/renderer.ts";

defineProps({});
const functionStore = useFunctionStore();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const showModal = defineModel('modelValue', {
  type: Boolean,
  default: false,
});
const showDetailDlg = ref(false);
const detailModelValue = ref<Partial<FunctionCode>>({});

const data = ref<Partial<FunctionCode>[]>([]);

const columns = computed(() => {
  return [
    {
      title: '名称',
      key: 'name',
      resizable: true,
      width: 150,
      render: (row: Partial<FunctionCode>) => {
        return h(NButton, {
          text: true,
          tag: 'a',
          type: 'primary',
          onClick: async () => {
            const data = await functionStore.findFunctionCodeById(row.id as string);
            detailModelValue.value = data || {};
            showDetailDlg.value = true;
          }
        }, () => row.name);
      }
    },
    {
      title: '功能类别',
      key: 'feature',
      width: 100,
      resizable: true,
      render: (row: Partial<Datasource>) => {
        return h('span', {}, FeatureTypes.find(i => i.value === row.feature)?.label || '');
      }
    },
    {
      title: '描述',
      key: 'description',
      resizable: true
    },
  ];
});

watch(showModal, (show) => {
  if (show) {
    getList();
  }
});

async function getList() {
  const res = await functionStore.getAllFunctionCode(page.value, pageSize.value);
  data.value = res.data;
  page.value = res.page;
  total.value = res.total;
}

function onUpdatePage(nextPage: number) {
  page.value = nextPage;
  getList();
}

function onCreate() {
  detailModelValue.value = {};
  showDetailDlg.value = true;
}

function onPositiveClick() {
  showModal.value = false;
}
</script>

<template>
  <n-modal
      v-model:show="showModal"
      preset="card"
      :style="{width: '68%'}"
      title="函数集"
      :bordered="false"
  >
    <n-space vertical>
      <n-button-group>
        <n-button type="primary" @click="onCreate">新建</n-button>
      </n-button-group>
      <n-data-table
          :columns="columns"
          :data="data"
          :bordered="false"
          :pagination="false"
      />
      <n-pagination v-model:page="page" :page-count="Math.floor(total / pageSize)" @update-page="onUpdatePage" />
    </n-space>
    <template #footer>
      <n-button-group>
        <n-button @click="onPositiveClick" type="primary">确定</n-button>
      </n-button-group>
    </template>
  </n-modal>
  <FunctionCodeDialog v-model="showDetailDlg" v-model:form-data="detailModelValue" @success="getList"/>
</template>

<style scoped lang="scss">

</style>