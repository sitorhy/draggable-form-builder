<script setup lang="ts">
import {h, watch} from "vue";
import {ref, computed} from 'vue';
import {NButton} from "naive-ui";
import {useDatasourceStore} from '../store.ts';
import type {Datasource} from "../types";
import DatasourceDialog from './DatasourceDialog.vue';

defineProps({});
const datasourceStore = useDatasourceStore();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const showModal = defineModel('modelValue', {
  type: Boolean,
  default: false,
});
const showDetailDlg = ref(false);
const detailModelValue = ref<Partial<Datasource>>({});

const data = ref<Partial<Datasource>[]>([]);

const columns = computed(() => {
  return [
    {
      title: '名称',
      key: 'name',
      resizable: true,
      width: 150,
      render: (row: Partial<Datasource>) => {
        return h(NButton, {
          text: true,
          tag: 'a',
          type: 'primary',
          onClick: async () => {
            const data = await datasourceStore.findDatasourceById(row.id as string);
            detailModelValue.value = data || {};
            showDetailDlg.value = true;
          }
        }, () => row.name);
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
  const res = await datasourceStore.getAllDatasource(page.value, pageSize.value);
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
      title="数据集查询"
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
  <DatasourceDialog v-model="showDetailDlg" v-model:form-data="detailModelValue" @success="getList"/>
</template>

<style scoped lang="scss">

</style>