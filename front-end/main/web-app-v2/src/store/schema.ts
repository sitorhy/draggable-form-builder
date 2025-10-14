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
import type { RendererItemDefinition } from '../types.ts';
import { createRendererItemConfig } from './component.ts';
import type { useBindingStore } from './binding.ts';
import { parseUri } from '../components/visual/data-source/config.ts';

// 处理配置有数据源的组件，将这些组件的path映射到staticContext
export function collectStaticContext(
	node: RendererItemDefinition,
	collection: Record<string, any>,
	bindingStore: ReturnType<typeof useBindingStore>
) {
	if (!node) {
		return;
	}
	const props = node.props;

	// 特殊属性名称 或者判断组件type 此处使用前者方案
	const propKeys = props ? Object.keys(props) : [];
	const partPath = props?.path;
	if (propKeys.includes('loop')) {
		if (node.props?.dataSource) {
			// 该组件具有数据源配置，具有loop属性的组件静态数据跟数据源互斥
			if (partPath) {
				// 重定向到 binding 域，bindingStore 不在 schema 域内
				// 1、增加 binding 域参数，读取 binding 路径
				// 2、binging 域数据覆盖 静态域数据

				// 使用方案2 PropertiesContext 处理组件级远程数据源时也是调用 assignStaticContext
				// 因为远程协议没有路径信息，远程数据必定是替换静态数据的存在

				// 此时静态数据起默认值作用
				collection[`${partPath}`] = props?.['loop'];

				if (bindingStore) {
					// 处理数据查找协议 查找协议有路径信息
					const dataSourceSchema = parseUri(node.props?.dataSource);
					const bindingPath = dataSourceSchema.path;

					// 存在外部绑定源 直接读取覆盖
					collection[`${partPath}`] = bindingStore.queryBinding(bindingPath);
				}
			}
		} else {
			if (partPath) {
				collection[`${partPath}`] = props?.['loop'];
			}
		}
	}
	// 递归schema树
	if (Array.isArray(node.children) && node.children.length > 0) {
		for (const child of node.children) {
			collectStaticContext(child, collection, bindingStore);
		}
	}
}

export const useSchemaStore = defineStore('schema', {
	state() {
		return {
			schema: createRendererItemConfig({ type: 'page' })
		};
	},
	actions: {
		resetSchema() {
			this.schema = createRendererItemConfig({ type: 'page' });
		},
		loadSchema(data: RendererItemDefinition) {
			this.schema = data;
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
