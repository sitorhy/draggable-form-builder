<script setup lang="ts">
import {h, type PropType} from "vue";
import {ref, computed} from 'vue';
import {NButton, NInput, useMessage} from "naive-ui";

defineProps({});
const message = useMessage();

const modelValue = defineModel('value', {
  type: Array as PropType<{ label: string; value: string; }[]>,
  default: () => [],
});

const showModal = ref(false);
const innerData = ref<{ label: string; value: string; }[]>([]);

const columns = computed(() => {
  return [
    {
      title: '标签',
      key: 'label',
      render(row: any, index: number) {
        return h(NInput, {
          value: row.label,
          placeholder: '',
          onUpdateValue(v) {
            innerData.value[index].label = v;
          }
        })
      }
    },
    {
      title: '值',
      key: 'value',
      render(row: any, index: number) {
        return h(NInput, {
          value: row.value,
          placeholder: '',
          onUpdateValue(v) {
            innerData.value[index].value = v;
          }
        })
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, index: number) => {
        return h(NButton,{
          type: 'error',
          onClick() {
            innerData.value.splice(index, 1);
          }
        }, () => '删除');
      }
    },
  ];
});

function onPositiveClick() {
  const keysSet = new Set([...innerData.value.map(i => i.value)]);
  if (keysSet.size != innerData.value.length) {
    message.warning('选项值重复');
    return;
  }
  modelValue.value = [...innerData.value].filter(i => !!i.value);
  showModal.value = false;
}

function onNegativeClick() {
  showModal.value = false;
}

function show() {
  innerData.value = JSON.parse(JSON.stringify(modelValue.value));
  showModal.value = true;
}

function onAddRow() {
  innerData.value.push({
    label: '',
    value: '',
  });
}
</script>

<template>
  <div>
    <n-button type="primary" @click="show">
      选项编辑
    </n-button>
    <n-modal
        v-model:show="showModal"
        preset="card"
        :style="{width: '600px'}"
        title="选项"
        :bordered="false"
    >
      <n-button-group>
        <n-button @click="onAddRow" type="primary">添加</n-button>
      </n-button-group>
      <n-data-table
          :columns="columns"
          :data="innerData"
          :bordered="false"
          :pagination="false"
      />
      <template #footer>
        <n-button-group>
          <n-button @click="onPositiveClick" type="primary">确定</n-button>
          <n-button @click="onNegativeClick">取消</n-button>
        </n-button-group>
      </template>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">

</style>