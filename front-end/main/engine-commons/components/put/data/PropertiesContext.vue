<script setup lang="ts">
import {
	computed,
	type ComputedRef,
	inject,
	onBeforeMount,
	type PropType,
	provide,
	ref,
	watch
} from 'vue';
import type {
	NormalizeDataSource,
	RendererItemDefinition
} from '../../../types';
import { useBindingStore } from '../../../store/binding';
import { parseUri } from '../../visual/data-source/config';
import { useEmptyBindingPath } from '../common/binding-path.ts';
import { useFunctionStore } from '../../../store/function.ts';
import {
	createModuleDefaultExecution,
	useFunctionContext
} from '../common/function-context.ts';
import { useRemoteDatasourceResolver } from '../common/props.ts';

const props = defineProps({
	schema: {
		type: Object as PropType<RendererItemDefinition>,
		default: () => ({})
	}
});

const { emptyBindingPath } = useEmptyBindingPath();
const bindingStore = useBindingStore();
const funcStore = useFunctionStore();

const bindingPath = inject<ComputedRef<string>>(
	'bindingPath',
	emptyBindingPath
);
const formItemBindingPath = inject<ComputedRef<string>>(
	'formItemBindingPath',
	emptyBindingPath
);

const message = inject<
	ComputedRef<{
		info: (text: string) => void;
		success: (text: string) => void;
		error: (text: string) => void;
	}>
>('messageTool');

const { resolveRemoteDatasource } = useRemoteDatasourceResolver();

const { functionContext } = useFunctionContext({
	getBindingPath: function () {
		return bindingPath.value;
	},
	getMessageTool: () => message?.value
});

const injectionObj = ref<Record<string, any>>({});
const injectionEvents = ref<Record<string, (...args: any[]) => any>>({});

const dataSource = computed<string>(() => {
	return props.schema?.props?.dataSource || '';
});

const binding = computed(() => {
	if (dataSource.value) {
		// 处理有数据源协议的组件
		if (props.schema.type === 'linearList') {
			// 对象协议优先级最低
			return {
				...props.schema.binding,
				loop: dataSource.value
			};
		}
		return props.schema.binding;
	} else {
		return props.schema.binding;
	}
});

const events = computed<Record<string, string>>(() => {
	return props.schema.events || {};
});

function injectProps(
	prop: string,
	result:
		| {
				source: string;
				value: any;
				fullBindingPath: string;
		  }
		| undefined,
	moduleNames?: string[]
) {
	if (result || (moduleNames && !result)) {
		const filters = (moduleNames || []).map((moduleName) => {
			return funcStore.tryGetDefaultFunctionByModuleName(moduleName);
		});
		let filterValue = result?.value;
		filters.forEach((filter) => {
			if (typeof filter === 'function') {
				filterValue = filter(filterValue);
			}
		});

		injectionObj.value[prop] = filterValue;

		if (result) {
			const { fullBindingPath } = result;
			if (result.source === 'static') {
				injectionObj.value['update:' + prop] = function (value: any) {
					bindingStore.updateStaticContext(fullBindingPath, value);
				};
			} else {
				injectionObj.value['update:' + prop] = function (value: any) {
					bindingStore.updateBinding(fullBindingPath, value);
				};
			}
		} else {
			injectionObj.value['update:' + prop] = function () {};
		}
		return;
	} else {
		delete injectionObj.value[prop];
		delete injectionObj.value['update:' + prop];
	}
}

function resolveLocalSchema(
	prop: string,
	dataSourceSchema: NormalizeDataSource
) {
	const resolvedPath = formItemBindingPath.value || bindingPath.value;
	if (resolvedPath) {
		switch (dataSourceSchema.host) {
			case 'path':
				{
					// 适用于具体变量查找
					let result = bindingStore.searchBinding(
						resolvedPath,
						dataSourceSchema.path
					);
					if (!result) {
						// 适用于数据源绑定
						result = bindingStore.searchStaticContext(
							bindingPath.value,
							dataSourceSchema.path
						);
					}

					injectProps(
						prop,
						result,
						(dataSourceSchema.filter || '').split(',').filter((i) => !!i)
					);
				}
				break;
		}
	}
}

async function resolveRemoteSchema(
	prop: string,
	dataSourceSchema: NormalizeDataSource
) {
	try {
		const data = await resolveRemoteDatasource(dataSourceSchema);

		const partPath = props.schema.props?.path;
		if (partPath) {
			bindingStore.assignStaticContext({
				[partPath]: data
			});

			injectionObj.value[prop] = bindingStore.staticContext[partPath];
		}
	} catch (error) {
		message?.value.error(
			error instanceof Error ? error.message : JSON.stringify(error)
		);
		console.error(error);
	}
}

/**
 * 将事件名称（如 'click'）转换为 Vue/React 风格的事件响应属性名称（如 'onClick'）。
 *
 * @param eventName 原始事件名称（小写，如 'click' 或 'change'）
 * @returns 转换后的属性名称（如 'onClick' 或 'onChange'）
 */
function toVueEventPropName(eventName: string): string {
	if (eventName.length === 0) {
		return '';
	}

	// 1. 获取事件名的第一个字母，并将其转换为大写
	const firstLetter = eventName.charAt(0).toUpperCase();

	// 2. 获取事件名其余的部分
	const restOfString = eventName.slice(1);

	// 3. 组合 'on' + 大写首字母 + 剩余部分
	return `on${firstLetter}${restOfString}`;
}

async function resolveEvents() {
	if (events.value && Object.keys(events.value).length > 0) {
		injectionEvents.value = Object.keys(events.value)
			.map((eventName: string) => {
				return [
					toVueEventPropName(eventName),
					createModuleDefaultExecution(
						events.value[eventName] as string,
						funcStore,
						functionContext
					)
				];
			})
			.reduce((s, i: any[]) => Object.assign(s, { [i[0]]: i[1] }), {});
	}
}

function resolveBinding() {
	const uriMap = binding.value;
	if (uriMap) {
		Object.keys(uriMap).forEach((prop) => {
			const uri = uriMap[prop];
			const dataSourceSchema = parseUri(uri as string);
			switch (dataSourceSchema.schema) {
				case 'object':
					{
						resolveLocalSchema(prop, dataSourceSchema);
					}
					break;
				case 'http':
					{
						resolveRemoteSchema(prop, dataSourceSchema);
					}
					break;
			}
		});
	}
}

watch(
	bindingStore.$state.state,
	function () {
		resolveBinding();
	},
	{
		immediate: true
	}
);

const funModuleNames = computed(() => {
	return funcStore.$state.modules.keys();
});

watch(
	events,
	function () {
		resolveEvents();
	},
	{
		immediate: true
	}
);

watch(funModuleNames, function () {
	resolveEvents();
});

onBeforeMount(() => {
	resolveBinding();
	resolveEvents();
});

/**
 * 深度合并对象，如果遇到同名且类型为函数的属性，
 * 则返回一个新的包装函数，确保 injectionEvents 的函数先执行，injectionObj 的函数后执行。
 * @param obj1 - 优先级较低的对象（基础属性或后执行的函数）
 * @param obj2 - 优先级较高的对象（事件或先执行的函数）
 * @returns 合并后的新对象
 */
function mergeListeners(
	obj1: Record<string, any>,
	obj2: Record<string, any>
): Record<string, any> {
	// 1. 以 obj1 为基础，包含所有不冲突的属性
	const merged = { ...obj1 };

	// 2. 遍历 obj2 的所有属性
	for (const key in obj2) {
		if (Object.prototype.hasOwnProperty.call(obj2, key)) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			// 检查属性是否同时存在于两个对象中，并且都是函数
			if (
				val1 &&
				val2 &&
				typeof val1 === 'function' &&
				typeof val2 === 'function'
			) {
				// --- 核心合并逻辑：创建包装函数 ---

				merged[key] = function (...args: any[]) {
					let result2;
					let result1;

					// 1. 执行 obj2 (injectionEvents) 的函数
					// 通常事件监听器不需要返回值，但为了健壮性保留结果
					try {
						result2 = val2.apply(this, args);
					} catch (e) {
						console.error(
							`Error executing event listener from injectionEvents (${key}):`,
							e
						);
					}

					// 2. 执行 obj1 (injectionObj) 的函数
					try {
						result1 = val1.apply(this, args);
					} catch (e) {
						console.error(
							`Error executing original property function (${key}):`,
							e
						);
					}

					// 返回 obj2 的结果，或根据具体业务需求决定返回哪个
					return result2 ?? result1;
				};
			} else {
				// 如果 obj2 的属性与 obj1 不冲突，或者不是函数，直接使用 obj2 的属性（覆盖）
				// 确保非函数的同名属性被 injectionEvents 覆盖
				merged[key] = val2;
			}
		}
	}

	return merged;
}

const propsInjection = computed(() => {
	return mergeListeners(injectionEvents.value, injectionObj.value);
});

provide('bindingProps', propsInjection);
</script>

<template>
	<slot></slot>
</template>

<style scoped lang="scss"></style>
