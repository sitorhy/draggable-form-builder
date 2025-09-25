<script setup lang="ts">
import { h, watch } from 'vue';
import { ref, computed } from 'vue';
import { NButton, type RowKey } from 'naive-ui';
import { useFunctionStore } from '../../store/function.ts';
import type { FunctionCode } from '../../types.ts';
import FunctionCodeDialog from './FunctionCodeDialog.vue';

const emit = defineEmits(['confirm']);

const props = defineProps({
	selectable: {
		type: Boolean,
		default: false
	}
});
const functionStore = useFunctionStore();
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);

const showModal = defineModel('modelValue', {
	type: Boolean,
	default: false
});
const showDetailDlg = ref(false);
const detailModelValue = ref<Partial<FunctionCode>>({});
const checkedRowKeysRef = ref([]);

const tableRef = ref();
const data = ref<Partial<FunctionCode>[]>([]);

const columns = computed(() => {
	const cols = [
		{
			title: '名称',
			key: 'name',
			resizable: true,
			width: 150,
			render: (row: Partial<FunctionCode>) => {
				return h(
					NButton,
					{
						text: true,
						tag: 'a',
						type: 'primary',
						onClick: async () => {
							const data = await functionStore.findFunctionCodeById(
								row.id as string
							);
							detailModelValue.value = data || {};
							showDetailDlg.value = true;
						}
					},
					() => row.name
				);
			}
		},
		{
			title: '描述',
			key: 'description',
			resizable: true
		}
	];

	if (props.selectable) {
		cols.unshift({
			type: 'selection'
		});
	}

	return cols;
});

watch(showModal, (show) => {
	if (show) {
		getList();
	}
});

async function getList() {
	const res = await functionStore.getAllFunctionCode(
		page.value,
		pageSize.value
	);
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
	if (props.selectable) {
		emit('confirm', checkedRowKeysRef.value);
	}
	showModal.value = false;
}

function rowKey(item: FunctionCode) {
	return item.name;
}

function handleCheck(rowKeys: RowKey[]) {
	checkedRowKeysRef.value = rowKeys;
}

defineExpose({
	select(codes: string[]) {
		checkedRowKeysRef.value = codes || [];
		showModal.value = true;
	}
});
</script>

<template>
	<n-modal
		v-model:show="showModal"
		preset="card"
		:style="{ width: '68%' }"
		title="函数集"
		:bordered="false"
	>
		<n-space vertical>
			<n-button-group v-if="!selectable">
				<n-button type="primary" @click="onCreate">新建</n-button>
			</n-button-group>
			<n-data-table
				ref="tableRef"
				:columns="columns"
				:data="data"
				:row-key="rowKey"
				:bordered="false"
				:pagination="false"
				:checked-row-keys="checkedRowKeysRef"
				@update:checked-row-keys="handleCheck"
			/>
			<n-pagination
				v-model:page="page"
				:page-count="Math.floor(total / pageSize)"
				@update-page="onUpdatePage"
			/>
		</n-space>
		<template #footer>
			<n-space v-if="selectable">
				<n-tag :key="i" type="info" v-for="i in checkedRowKeysRef">{{
					i
				}}</n-tag>
			</n-space>
			<n-divider v-if="selectable" />
			<n-button-group>
				<n-button @click="onPositiveClick" type="primary">确定</n-button>
			</n-button-group>
		</template>
	</n-modal>
	<FunctionCodeDialog
		v-model="showDetailDlg"
		v-model:form-data="detailModelValue"
		@success="getList"
	/>
</template>

<style scoped lang="scss"></style>
