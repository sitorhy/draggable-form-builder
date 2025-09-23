<script setup lang="ts">
import { computed } from 'vue';
import { BaseTree, OpenIcon } from '@he-tree/vue';
import { useSchemaActions, useSchemaStore } from '../../store/schema.ts';
import { getIconByType, useComponentsStore } from '../../store/component.ts';
import { Settings24Regular, Delete24Regular } from '@vicons/fluent';

import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';
import type { RendererItemDefinition } from '../../types.ts';
import { useEmphasizeStore } from '../../store/emphasize.ts';

const emit = defineEmits(['node:setting']);

const schemaStore = useSchemaStore();
const componentsStore = useComponentsStore();
const emphasizeStore = useEmphasizeStore();
const { removeNodeById } = useSchemaActions();

const NON_SCHEMA_ID = '#';

type TreeNode = {
	label: string;
	type: string;
	id: string;
	children?: TreeNode[];
	showSetting?: boolean;
};

type CheckedTreeNode = {
	data: TreeNode;
};

function mapStaticNodes(nodes: TreeNode[]) {
	return nodes.map((node: TreeNode) => {
		return {
			...node,
			showSetting: true,
			showDelete: false
		};
	});
}

function mapToVisualTree(schemas: RendererItemDefinition[]): TreeNode[] {
	return schemas.map(function (schema) {
		const node: TreeNode = {
			label: componentsStore.getComponentNameByType(schema.type) || schema.type,
			type: schema.type,
			id: schema.id,
			showSetting: true,
			showDelete: true
		};

		if (schema.type === 'list') {
			node.children = [
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '首部内容插槽',
					children: mapStaticNodes(
						mapToVisualTree(
							schema.props?.slots?.prefix ? [schema.props?.slots.prefix] : []
						)
					),
					showSetting: false,
					showDelete: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '内容插槽',
					children: mapStaticNodes(mapToVisualTree(schema.children || [])),
					showSetting: false,
					showDelete: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '尾部内容插槽',
					children: mapStaticNodes(
						mapToVisualTree(
							schema.props?.slots?.suffix ? [schema.props?.slots.suffix] : []
						)
					),
					showSetting: false,
					showDelete: false
				}
			];
		} else {
			if (Array.isArray(schema.children)) {
				node.children = mapToVisualTree(schema.children);
			}
		}

		return node;
	});
}

const treeData = computed(function () {
	return mapToVisualTree([schemaStore.schema]);
});

const watchingSchemaId = computed(function () {
	return emphasizeStore.schemaId;
});

function onNodeClick(node: CheckedTreeNode) {
	if (node.data.id) {
		if (node.data.id === NON_SCHEMA_ID) {
			emphasizeStore.unwatchSchema();
			return;
		}
		emphasizeStore.watchSchema(node.data.id);
	}
}

function onSettingClick(node: TreeNode) {
	if (node) {
		if (node.id === NON_SCHEMA_ID) {
			emphasizeStore.unwatchSchema();
			return;
		}
		emphasizeStore.watchSchema(node.id);
		emit('node:setting', node);
	}
}

function onDeleteClick(node: TreeNode) {
	if (node) {
		if (node.id === NON_SCHEMA_ID) {
			emphasizeStore.unwatchSchema();
			return;
		}
		removeNodeById(node.id);
		if (emphasizeStore.$state.schemaId === node.id) {
			emphasizeStore.unwatchSchema();
		}
	}
}
</script>

<template>
	<BaseTree
		@click:node="onNodeClick"
		class="mtl-tree"
		v-model="treeData"
		treeLine
	>
		<template #default="{ node, stat }">
			<OpenIcon
				v-if="stat.children.length"
				:open="stat.open"
				class="mtl-mr"
				@click="stat.open = !stat.open"
			/>
			<div class="mtl-ml">
				<div
					:class="[
						'node-desc',
						watchingSchemaId === node.id ? 'emphasize' : ''
					]"
				>
					<n-space align="center" :size="5">
						<n-icon><component :is="getIconByType(node.type)" /></n-icon>
						<span>{{ node.label }}</span>
						<n-space :size="5" class="node-desc-actions" align="center">
							<n-icon
								color="#18a058"
								v-if="node.showSetting"
								@click.stop="onSettingClick(node)"
							>
								<Settings24Regular />
							</n-icon>

							<n-icon
								color="#18a058"
								v-if="node.showDelete"
								@click.stop="onDeleteClick(node)"
							>
								<Delete24Regular />
							</n-icon>
						</n-space>
					</n-space>
				</div>
			</div>
		</template>
	</BaseTree>
</template>

<style lang="scss" scoped>
.node-desc {
	display: flex;

	&.emphasize {
		span {
			color: green;
			font-weight: bold;
		}
	}
}

.node-desc-actions {
	visibility: hidden;
}

.tree-node:hover .node-desc-actions {
	visibility: visible;
}
</style>
