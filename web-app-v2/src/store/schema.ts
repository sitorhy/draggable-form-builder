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
import type { RendererItemDefinition } from '../types';
// import { unitTest } from '../test/data.ts';
import { createRendererItemConfig } from './component.ts';

export const useSchemaStore = defineStore<
	'schema',
	{
		schema: RendererItemDefinition;
	}
>('schema', {
	state() {
		return {
			schema: createRendererItemConfig({ type: 'page' })
			// schema: unitTest()
		};
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
