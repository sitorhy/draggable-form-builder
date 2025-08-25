import { type ComputedRef, getCurrentInstance } from 'vue';

export function useBindingPath(
	props: ComputedRef<{
		bracket: boolean;
		path: string;
		parseNumber: boolean;
	}>
) {
	function getCurrentPathConfig(options: {
		bracket: boolean;
		path: string;
		parseNumber: boolean;
	}) {
		return {
			sep: options.bracket ? '' : '.',
			path: options.bracket
				? [
						'[',
						options.parseNumber
							? options.path
							: `'${options.path}'`,
						']'
					].join('')
				: options.path
		};
	}

	function joinPathConfig(bindings: { sep: string; path: string }[]) {
		return bindings
			.reverse()
			.map((item, index) => {
				return index === 0 ? `${item.path}` : `${item.sep}${item.path}`;
			})
			.join('');
	}

	function collectParentBindingPathConfig(): { sep: string; path: string }[] {
		const parentBindings = [];
		let instance = getCurrentInstance()?.parent;
		while (instance) {
			if (instance.type.__name === 'BindingContext') {
				if (instance.props && instance.props.path) {
					parentBindings.push(
						getCurrentPathConfig(
							instance.props as {
								bracket: boolean;
								path: string;
								parseNumber: boolean;
							}
						)
					);
				}
			}
			instance = instance?.parent;
		}

		return parentBindings;
	}

	function collectBindingPathConfig() {
		const bindings = collectParentBindingPathConfig();
		bindings.unshift(getCurrentPathConfig(props.value));
		return bindings;
	}

	function getBindingPath() {
		if (!props.value.path) {
			return '';
		}
		const parentBindings = collectBindingPathConfig();
		return joinPathConfig(parentBindings);
	}

	function splitPathConfig(path: string): { sep: string; path: string }[] {
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
					path.indexOf(segments[index - 1]) +
					segments[index - 1].length;
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

	return {
		getCurrentPathConfig,
		joinPathConfig,
		collectBindingPathConfig,
		collectParentBindingPathConfig,
		getBindingPath,
		splitPathConfig
	};
}
