import { defineStore } from 'pinia';
import type { RendererItemDefinition } from '../types.ts';
import { v4 as uuid } from 'uuid';
import type { useBindingStore } from './binding.ts';
import { parseUri } from '../components/visual/data-source/config.ts';

export function collectStaticContext(
	node: RendererItemDefinition,
	collection: Record<string, any>,
	bindingStore: ReturnType<typeof useBindingStore>
) {
	if (!node) {
		return;
	}
	const props = node.props;

	const propKeys = props ? Object.keys(props) : [];
	const partPath = props?.path;
	if (propKeys.includes('loop')) {
		if (node.props?.dataSource) {
			if (partPath) {
				collection[`${partPath}`] = props?.['loop'];

				if (bindingStore) {
					const dataSourceSchema = parseUri(node.props?.dataSource);
					const bindingPath = dataSourceSchema.path;
					collection[`${partPath}`] = bindingStore.queryBinding(bindingPath);
				}
			}
		} else {
			if (partPath) {
				collection[`${partPath}`] = props?.['loop'];
			}
		}
	}

	if (Array.isArray(node.children) && node.children.length > 0) {
		for (const child of node.children) {
			collectStaticContext(child, collection, bindingStore);
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
		resetSchema() {
			this.schema = {
                type: 'page',
                id: uuid(),
                children: [],
                props: {
                    format: 'WEB'
                }
            } as RendererItemDefinition;
		},
		loadSchema(data: RendererItemDefinition) {
			this.schema = data;
		}
	}
});