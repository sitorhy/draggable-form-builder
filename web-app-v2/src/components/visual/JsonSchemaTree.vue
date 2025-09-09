<script setup lang="ts">
import { computed } from 'vue';
import { BaseTree, OpenIcon } from '@he-tree/vue';
import { useSchemaStore } from '../../store/schema.ts';
import { useComponentsStore } from '../../store/component.ts';
import { Info24Regular } from '@vicons/fluent';

import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';
import type { RendererItemDefinition } from '../../types.ts';
import { useEmphasizeStore } from '../../store/emphasize.ts';

const schemaStore = useSchemaStore();
const componentsStore = useComponentsStore();
const emphasizeStore = useEmphasizeStore();

const NON_SCHEMA_ID = '#';

type TreeNode = {
	label: string;
	type: string;
	id: string;
	children?: TreeNode[];
	showInfo?: boolean;
};

type CheckedTreeNode = {
	data: TreeNode;
};

function mapToVisualTree(schemas: RendererItemDefinition[]): TreeNode[] {
	return schemas.map(function (schema) {
		const node: TreeNode = {
			label: componentsStore.getComponentNameByType(schema.type) || schema.type,
			type: schema.type,
			id: schema.id,
			showInfo: true
		};

		if (schema.type === 'list') {
			node.children = [
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '首部内容插槽',
					children: mapToVisualTree(
						schema.props?.slots.prefix ? [schema.props?.slots.prefix] : []
					),
					showInfo: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '内容插槽',
					children: mapToVisualTree(schema.children || []),
					showInfo: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '尾部内容插槽',
					children: mapToVisualTree(
						schema.props?.slots.suffix ? [schema.props?.slots.suffix] : []
					),
					showInfo: false
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
					<span>{{ node.label }}</span>
					<div class="node-desc-actions">
						<n-icon color="#18a058" v-if="node.showInfo">
							<Info24Regular />
						</n-icon>
					</div>
				</div>
			</div>
		</template>
	</BaseTree>
</template>

<style lang="scss" scoped>
.node-desc {
	display: flex;

	&.emphasize {
		> span {
			color: green;
			font-weight: bold;
		}
	}
}

.node-desc-actions {
	padding-top: 2px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	visibility: hidden;

	> * {
		margin-left: 4px;
	}
}

.tree-node:hover .node-desc-actions {
	visibility: visible;
}
</style>
