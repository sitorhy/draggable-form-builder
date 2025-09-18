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
import { unitTest } from '../test/data';
import type { RendererItemDefinition } from '../types';

export const useSchemaStore = defineStore<
	'schema',
	{
		schema: RendererItemDefinition;
	}
>('schema', {
	state() {
		return {
			schema: unitTest()
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
			moveTo(store.schema, id, targetParentId, targetBeforeId)
	};
}
