import { defineStore } from 'pinia';
import { useSchemaStore } from './schema.ts';
import {
	findNodeById,
	findParentByNodeId,
	indexOfParent,
	moveTo
} from './nodes.ts';
import type { RendererItemDefinition } from '../types.ts';

export const useSchemaContextStore = defineStore('schemaContext', {
	state() {
		return {
			treeDragging: false,
			treeDraggingSchemaId: ''
		};
	},
	getters: {
		schemaStore: () => useSchemaStore()
	},
	actions: {
		startDrag(schemaId: string) {
			this.treeDraggingSchemaId = schemaId;
			this.treeDragging = true;
		},
		endDrag(anchorSchemaId: string, action: string) {
			console.log(anchorSchemaId);
			if (action) {
				switch (action) {
					case 'insertBefore':
						{
							// anchorSchemaId 为组件id
							const id = this.treeDraggingSchemaId;
							const targetParentId = findParentByNodeId(
								this.schemaStore.schema,
								anchorSchemaId
							)?.id;
							moveTo(
								this.schemaStore.schema,
								id,
								targetParentId as string,
								anchorSchemaId
							);
						}
						break;
					case 'insertAfter':
						{
							const id = this.treeDraggingSchemaId;
							const targetParent = findParentByNodeId(
								this.schemaStore.schema,
								anchorSchemaId
							);
							const anchorIndex = indexOfParent(
								targetParent as RendererItemDefinition,
								{
									type: '',
									id: anchorSchemaId
								}
							);
							moveTo(
								this.schemaStore.schema,
								id,
								targetParent?.id as string,
								targetParent && targetParent.children
									? targetParent.children[anchorIndex + 1]?.id
									: undefined
							);
						}
						break;
					case 'unshift':
						{
							// anchorSchemaId 为容器id
							const id = this.treeDraggingSchemaId;
							const targetParent = findNodeById(
								this.schemaStore.schema,
								anchorSchemaId
							);
							moveTo(
								this.schemaStore.schema,
								id,
								targetParent?.id as string,
								targetParent && targetParent.children
									? targetParent.children[0]?.id
									: undefined
							);
						}
						break;
					case 'push':
						{
							const id = this.treeDraggingSchemaId;
							const targetParent = findNodeById(
								this.schemaStore.schema,
								anchorSchemaId
							);
							moveTo(
								this.schemaStore.schema,
								id,
								targetParent?.id as string,
								undefined
							);
						}
						break;
				}
			}

			this.treeDraggingSchemaId = '';
			this.treeDragging = false;
		}
	}
});
