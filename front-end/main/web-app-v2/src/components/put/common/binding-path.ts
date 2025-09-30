import { computed, type ComputedRef, getCurrentInstance } from 'vue';

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

export function resolveContextPath(props: Record<string, any>): any {
	const bindingPath = props.schema.props?.path;
	return bindingPath || '';
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
							path:
								instance.props.customPath ||
								instance.exposed?.bindingContextPath?.value ||
								'',
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
		getBindingPath
	};
}

export function useEmptyBindingPath() {
	const emptyBindingPath = computed(() => '');
	return {
		emptyBindingPath
	};
}
