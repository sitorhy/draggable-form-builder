import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import type { RendererItemDefinition } from '../types.ts';

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
			schema: {
                type: 'page',
                id: uuid(),
                children: [],
                props: {
                    format: 'WEB'
                }
            } as RendererItemDefinition
		};
	},
	actions: {
		collectStaticContext() {
			const obj = {};
			collectStaticContext(this.schema, obj);
			return obj;
		},
		resetSchema() {
			this.schema = {
                type: 'page',
                id: uuid(),
                children: [],
                props: {
                    format: 'WEB'
                }
            };
		},
		loadSchema(data: RendererItemDefinition) {
			this.schema = data;
		}
	}
});
