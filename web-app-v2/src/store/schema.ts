import {
	findNodeById,
	findParentByNodeId,
	insertBefore,
	insertBeforeId,
	insertBeforeIndex,
	findAncestorsByNodeId,
	moveTo
} from './nodes';
import { defineStore } from 'pinia';
import { unitTest } from '../test/data.ts';
import type { RendererItemDefinition } from '../types.ts';
// import { createRendererItemConfig } from './component.ts';

function collectStaticContext(
	node: RendererItemDefinition,
	collection: Record<string, any>
) {
	if (!node) {
		return;
	}
	const props = node.props;
	const propKeys = props ? Object.keys(props) : [];
	const partPath = props?.path;
	if (propKeys.includes('loop')) {
		if (partPath) {
			collection[`${partPath}`] = props?.['loop'];
		}
	}
	if (Array.isArray(node.children) && node.children.length > 0) {
		for (const child of node.children) {
			collectStaticContext(child, collection);
		}
	}
}

export const useSchemaStore = defineStore('schema', {
	state() {
		return {
			// schema: createRendererItemConfig({ type: 'page' })
			schema: unitTest()
		};
	},
	actions: {
		collectStaticContext() {
			const obj = {};
			collectStaticContext(this.schema, obj);
			return obj;
		}
	}
});

export function useSchemaActions() {
	const store = useSchemaStore();

	return {
		findNodeById: (id: string) => findNodeById(store.schema, id),
		findParentByNodeId: (id: string) => findParentByNodeId(store.schema, id),
		findAncestorsByNodeId: (id: string) =>
			findAncestorsByNodeId(store.schema, id),
		insertBefore,
		insertBeforeId,
		insertBeforeIndex,
		moveTo: (id: string, targetParentId: string, targetBeforeId?: string) =>
			moveTo(store.schema, id, targetParentId, targetBeforeId),
		removeNodeById: (id: string) => {
			const parent = findParentByNodeId(store.schema, id);
			if (parent) {
				const children = parent.children;
				if (children) {
					const index = children?.findIndex((c) => c.id === id);
					if (index !== -1) {
						children.splice(index, 1);
						return true;
					}
				}
			}
			return false;
		}
	};
}
