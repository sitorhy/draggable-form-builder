<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { BaseTree, OpenIcon } from '@he-tree/vue';
import { useSchemaActions, useSchemaStore } from '../../store/schema.ts';
import { getIconByType, useComponentsStore } from '../../store/component.ts';
import {
	Settings24Regular,
	Delete24Regular,
	Drag24Regular,
	Info24Regular,
	ArrowCurveDownRight20Regular,
	ArrowCurveUpRight20Regular,
	ArrowExportUp24Regular,
	ArrowDownload24Regular
} from '@vicons/fluent';

import '@he-tree/vue/style/default.css';
import '@he-tree/vue/style/material-design.css';
import type { RendererItemDefinition } from '../../types.ts';
import { useEmphasizeStore } from '../../store/emphasize.ts';
import { useSchemaContextStore } from '../../store/schema-context.ts';
import { useNotification } from 'naive-ui';

// 静态容器类别，允许插入节点
const STATIC_CONTAINER_TYPE = ['container', 'page'];
// 动态容器类别，不允许插入节点
const DYNAMIC_CONTAINER_TYPE = [
	'linearList',
	'list',
	'form',
	'grid',
	'radioGroup'
];

const notification = useNotification();

const emit = defineEmits(['node:setting']);

const schemaStore = useSchemaStore();
const schemaContextStore = useSchemaContextStore();
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
	showDelete?: boolean;
	showDrag?: boolean;
	showDrop?: boolean;
	showInfo?: boolean;
};

type CheckedTreeNode = {
	data: TreeNode;
};

const treeDragging = computed(() => {
	return schemaContextStore.$state.treeDragging;
});

const treeDraggingSchemaId = computed(() => {
	return schemaContextStore.$state.treeDraggingSchemaId;
});

function mapStaticNodes(nodes: TreeNode[]) {
	return nodes.map((node: TreeNode) => {
		return {
			...node,
			showSetting: !treeDragging.value,
			showDelete: false,
			showDrag: false,
			showDrop: treeDragging.value && treeDraggingSchemaId.value !== node.id,
			showInfo: true
		};
	});
}

function mapToVisualTree(
	schemas: RendererItemDefinition[],
	level: number,
	options?: {
		isStaticContainerParent?: boolean;
		isDynamicContainerParent?: boolean;
		isInDraggableAncestor?: boolean;
	}
): TreeNode[] {
	return schemas.map(function (schema) {
		const node: TreeNode = {
			label: componentsStore.getComponentNameByType(schema.type) || schema.type,
			type: schema.type,
			id: schema.id,
			showSetting: !treeDragging.value,
			showDelete:
				level > 0 && !treeDragging.value && !options?.isDynamicContainerParent,
			showDrag:
				level > 0 && !treeDragging.value && !options?.isDynamicContainerParent,
			showDrop:
				level >= 0 &&
				treeDragging.value &&
				treeDraggingSchemaId.value !== schema.id &&
				!options?.isInDraggableAncestor,
			showInfo: true
		};

		if (schema.type === 'list') {
			node.children = [
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '首部内容插槽',
					children: mapStaticNodes(
						mapToVisualTree(
							schema.props?.slots?.prefix ? [schema.props?.slots.prefix] : [],
							level + 1,
							options
						)
					),
					showSetting: false,
					showDelete: false,
					showDrag: false,
					showDrop: false,
					showInfo: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '内容插槽',
					children: mapStaticNodes(
						mapToVisualTree(schema.children || [], level + 1, options)
					),
					showSetting: false,
					showDelete: false,
					showDrag: false,
					showDrop: false,
					showInfo: false
				},
				{
					id: NON_SCHEMA_ID,
					type: 'slot',
					label: '尾部内容插槽',
					children: mapStaticNodes(
						mapToVisualTree(
							schema.props?.slots?.suffix ? [schema.props?.slots.suffix] : [],
							level + 1,
							options
						)
					),
					showSetting: false,
					showDelete: false,
					showDrag: false,
					showDrop: false,
					showInfo: false
				}
			];
		} else {
			if (Array.isArray(schema.children)) {
				node.children = mapToVisualTree(schema.children, level + 1, {
					isStaticContainerParent: STATIC_CONTAINER_TYPE.includes(schema.type),
					isDynamicContainerParent: DYNAMIC_CONTAINER_TYPE.includes(
						schema.type
					),
					isInDraggableAncestor:
						!!options?.isInDraggableAncestor ||
						treeDraggingSchemaId.value === schema.id
				});
			}
		}

		return node;
	});
}

const treeData = computed(function () {
	return mapToVisualTree([schemaStore.schema], 0, {
		isStaticContainerParent: true,
		isDynamicContainerParent: false,
		isInDraggableAncestor: false
	});
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

function onDrag(node: TreeNode) {
	console.log(node);
	schemaContextStore.startDrag(node.id);

	notification.create({
		title: '移动节点',
		content: `选择目标位置，右键取消移动`,
		duration: 3000,
		closable: true
	});
}

function onDrop(node: TreeNode, action: string) {
	schemaContextStore.endDrag(node.id, action);
}

function onRightClick(e: MouseEvent) {
	if (treeDragging.value) {
		e.preventDefault();
		schemaContextStore.endDrag('', '');
	}
}

onMounted(function () {
	window.addEventListener('contextmenu', onRightClick);
});

onUnmounted(function () {
	window.removeEventListener('contextmenu', onRightClick);
});
</script>

<template>
	<BaseTree
		@click:node="onNodeClick"
		class="mtl-tree"
		:class="[treeDragging ? 'dragging' : '']"
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
						watchingSchemaId === node.id ? 'emphasize' : '',
						treeDragging
							? treeDraggingSchemaId === node.id
								? 'dragging'
								: ['droppable', node.type]
							: ''
					]"
				>
					<n-space align="center" :size="5">
						<n-icon><component :is="getIconByType(node.type)" /></n-icon>
						<span>{{ node.label }}</span>
						<n-space :size="5" class="node-desc-actions" align="center">
							<n-tooltip trigger="click" v-if="node.showInfo">
								<template #trigger>
									<n-icon color="#18a058">
										<Info24Regular />
									</n-icon>
								</template>
								<span>{{ node.id }}</span>
							</n-tooltip>

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

							<n-icon
								color="#18a058"
								v-if="node.showDrag"
								@click.stop="onDrag(node)"
							>
								<Drag24Regular />
							</n-icon>

							<template
								v-if="
									treeDragging &&
									node.showDrop &&
									STATIC_CONTAINER_TYPE.includes(node.type)
								"
							>
								<n-tooltip trigger="hover" v-if="node.showInfo">
									<template #trigger>
										<n-icon
											color="#18a058"
											@click.stop="onDrop(node, 'unshift')"
										>
											<ArrowExportUp24Regular />
										</n-icon>
									</template>
									<span>到容器头部</span>
								</n-tooltip>

								<n-tooltip trigger="hover" v-if="node.showInfo">
									<template #trigger>
										<n-icon color="#18a058" @click.stop="onDrop(node, 'push')">
											<ArrowDownload24Regular />
										</n-icon>
									</template>
									<span>到容器尾部</span>
								</n-tooltip>
							</template>

							<template
								v-if="
									treeDragging &&
									node.showDrop &&
									!STATIC_CONTAINER_TYPE.includes(node.type)
								"
							>
								<n-tooltip trigger="hover" v-if="node.showInfo">
									<template #trigger>
										<n-icon
											color="red"
											@click.stop="onDrop(node, 'insertBefore')"
										>
											<ArrowCurveUpRight20Regular />
										</n-icon>
									</template>
									<span>到控件前面</span>
								</n-tooltip>

								<n-tooltip trigger="hover" v-if="node.showInfo">
									<template #trigger>
										<n-icon
											color="red"
											@click.stop="onDrop(node, 'insertAfter')"
										>
											<ArrowCurveDownRight20Regular />
										</n-icon>
									</template>
									<span>到控件后面</span>
								</n-tooltip>
							</template>
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

	&.dragging {
		span {
			color: blue;
			font-weight: bold;
		}
	}

	&.droppable {
		span {
			color: red;
		}

		&.container,
		&.page {
			span {
				color: green;
			}
		}
	}
}

.tree-node .node-desc-actions {
	visibility: hidden;
}

.dragging .tree-node .node-desc-actions {
	visibility: visible;
}

.tree-node:hover .node-desc-actions {
	visibility: visible;
}

.tree-node:hover .node-desc {
	&.droppable {
		span {
			color: black;
		}
	}
}
</style>
