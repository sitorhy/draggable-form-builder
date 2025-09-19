import { computed, type ComputedRef, getCurrentInstance } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

export function getCurrentPathConfig(options: {
	bracket: boolean;
	path: string;
	parseNumber: boolean;
}) {
	return {
		sep: options.bracket || options.path === '' ? '' : '.',
		path: options.bracket
			? [
					'[',
					options.parseNumber ? options.path : `'${options.path}'`,
					']'
				].join('')
			: options.path
	};
}

export function joinPathConfig(bindings: { sep: string; path: string }[]) {
	return bindings
		.reverse()
		.map((item, index) => {
			return index === 0 ? `${item.path}` : `${item.sep}${item.path}`;
		})
		.join('');
}

export function splitPathConfig(path: string): { sep: string; path: string }[] {
	// 使用正则表达式来捕获所有路径片段。
	// 这段正则会匹配：
	//   1. 任何非 . 和 [ 的字符序列
	//   2. 或者像 [数字] 这样的方括号索引
	const segments = path.match(/[^.\[]+|\[\d+]/g);
	if (!segments) {
		return [];
	}

	const result = segments.map((segment, index) => {
		let sep = '';
		if (index > 0) {
			// 获取当前片段在原始路径字符串中的起始位置
			const startIndex = path.indexOf(segment);
			// 找到前一个片段的末尾
			const prevSegmentEnd =
				path.indexOf(segments[index - 1]) + segments[index - 1].length;
			// 提取中间的字符作为分隔符
			sep = path.substring(prevSegmentEnd, startIndex);
		}

		return {
			sep,
			path: segment
		};
	});

	// 最终结果需要反向，以匹配 joinPathConfig 的输入格式
	return result.reverse();
}

export function useComponentBindingPath(
	options: ComputedRef<{
		bracket: boolean;
		path: string;
		parseNumber: boolean;
	}>
) {
	function collectParentBindingPathConfig(): { sep: string; path: string }[] {
		const parentBindings = [];
		let instance = getCurrentInstance()?.parent;
		while (instance) {
			if (instance.type.__name === 'BindingContext') {
				if (instance.exposed?.bindingContextPath) {
					parentBindings.push(
						getCurrentPathConfig({
							bracket: instance.props.bracket as boolean,
							path: instance.exposed?.bindingContextPath as string,
							parseNumber: instance.props.parseNumber as boolean
						})
					);
				}
			}
			instance = instance?.parent;
		}

		return parentBindings;
	}

	function collectBindingPathConfig() {
		const bindings = collectParentBindingPathConfig();
		const self = getCurrentInstance();
		if (self && self.type.__name === 'BindingContext') {
			// <slot></slot> getCurrentInstance 直接访问的是子组件
			bindings.unshift(getCurrentPathConfig(options.value));
		}
		return bindings;
	}

	function getBindingPath() {
		const parentBindings = collectBindingPathConfig();
		return joinPathConfig(parentBindings);
	}

	return {
		collectBindingPathConfig,
		collectParentBindingPathConfig,
		getBindingPath
	};
}

export function useEmptyBindingPath() {
	const emptyBindingPath = computed(() => '');
	return {
		emptyBindingPath
	};
}

export const useBindingPathsCacheStore = defineStore<
	'bindingPaths',
	{
		paths: {
			id: string;
			schemaId: string;
			bindingPath: string;
		}[];
	},
	{},
	{
		searchByPath: (part: string) => {
			id: string;
			schemaId: string;
			bindingPath: string;
		}[];
		add: (path: string) => void;
		remove: (path: string) => void;
	}
>('bindingPaths', {
	state() {
		return {
			paths: []
		};
	},
	actions: {
		searchByPath(part: string) {
			return this.paths.filter((p) => p.bindingPath.indexOf(part) >= 0);
		},
		add(path: string, schemaId: string) {
			if (
				this.paths.findIndex(
					(p) => path === p.bindingPath && p.schemaId === schemaId
				) < 0
			) {
				this.paths.push({
					bindingPath: path,
					id: uuid(),
					schemaId: schemaId
				});
			}
		},
		remove(path: string, schemaId: string) {
			const index = this.paths.findIndex(
				(p) => p.bindingPath === path && p.schemaId === schemaId
			);
			if (index >= 0) {
				this.paths.splice(index, 1);
			}
		}
	}
});
