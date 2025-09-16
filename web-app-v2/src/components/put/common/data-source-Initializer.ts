import type { NormalizeDataSource } from '../../../types.ts';
import { computed, type ComputedRef, onBeforeMount, toRaw } from 'vue';
import { useBindingConnector } from '../../../store/binding.ts';
import { useMessage } from 'naive-ui';

/**
 * 往 bingStore 注入对象，根据协议获取数据，静态数据或远程数据
 * 注入后使用 useBindingConnector 获取响应值
 * 原子组件如果有默认值属性实现，则可能不需要该功能进行初始化，直接使用 useBindingConnector 进行读写
 * @param options
 */
export function useDataSourceInitializer(
	options: ComputedRef<{
		bindingPath: string; // 注入路径
		staticValue: any; // 注入结构
		static: boolean; // true 注入 staticValue / false 解析数据源协议
		dataSource: NormalizeDataSource; // 统一数据源配置
	}>
) {
	const message = useMessage();
	const connectorOptions = computed(() => {
		return {
			path: options.value.bindingPath
		};
	});
	const { updateBinding, queryBinding } = useBindingConnector(
		connectorOptions,
		{
			onError: (e: Error) => message.error(e.message)
		}
	);

	const isStatic = options.value.static;

	onBeforeMount(function () {
		if (isStatic) {
			// 复制源结构
			updateBinding(structuredClone(toRaw(options.value.staticValue)));
		}
	});

	return {
		updateBinding,
		queryBinding
	};
}
