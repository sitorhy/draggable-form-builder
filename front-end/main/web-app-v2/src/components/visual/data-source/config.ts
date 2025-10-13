import { computed, onMounted, ref, watch } from 'vue';
import {
	DATA_SOURCE_HTTP_SCHEMA_HOST,
	DATA_SOURCE_OBJECT_SCHEMA_HOST,
	DATA_SOURCE_SCHEMAS
} from '../../put/common/constants.ts';
import { type FormItemRule, NInput, NSelect } from 'naive-ui';
import type { NormalizeDataSource } from '../../../types.ts';
import FunctionCodeSelect from '../FunctionCodeSelect.vue';

export function stringifyDataSourceSchema(options: NormalizeDataSource) {
	if (options && options.schema && options.host && options.path) {
		if (options.schema === 'http') {
			let uri = `${options.schema}://${options.host}/${options.path.replace(/^\//, '')}`;
			const qs = [options.filter ? 'filter=' + options.filter : '']
				.filter((i) => !!i)
				.join('&');
			if (qs) {
				uri += `?${qs}`;
			}
			return uri;
		} else {
			let uri = `${options.schema}://${options.host}:${options.path}`;
			const qs = [options.filter ? 'filter=' + options.filter : '']
				.filter((i) => !!i)
				.join('&');
			if (qs) {
				uri += `?${qs}`;
			}
			return uri;
		}
	}
	return '';
}

export function parseUri(uri: string): NormalizeDataSource {
	let result = {
		schema: '',
		host: '',
		path: '',
		filter: ''
	};

	if (!uri) {
		return result;
	}

	if (uri.startsWith('http')) {
		result.schema = 'http';

		// 1. 定义占位符和替换值
		const placeholderHost = 'placeholder.com';
		// 替换占位符，使其成为一个有效的 URL
		const validUri = uri.replace('${BASE_URL}', placeholderHost);

		const url = new URL(validUri);
		const params = url.searchParams;

		let filterValue = '';
		const remainingParams = [];

		const targetFilterKey = 'filter';

		// 2. 遍历参数，提取 filter 的值，同时构建剩余参数列表
		for (const [key, value] of params.entries()) {
			if (key === targetFilterKey) {
				filterValue = value;
			} else {
				// 保留所有非 'filter' 参数及其原始大小写
				remainingParams.push(`${key}=${value}`);
			}
		}

		// 3. 重构 path 字段
		let customPath = url.pathname;
		if (remainingParams.length > 0) {
			customPath += '?' + remainingParams.join('&');
		}

		// 4. 组装结果对象，将 host 还原为占位符
		result = {
			schema: url.protocol.slice(0, -1),
			// 还原 host 字段中的占位符
			host: url.host === placeholderHost ? '${BASE_URL}' : url.host,
			path: customPath,
			filter: filterValue
		};
	} else {
		// 1. 查找并拆分 schema
		const schemaSeparatorIndex = uri.indexOf('://');
		if (schemaSeparatorIndex === -1) {
			return result; // 格式不正确，返回空
		}
		result.schema = uri.substring(0, schemaSeparatorIndex);

		// 2. 截取剩余部分，并查找 host 和 path
		const rest = uri.substring(schemaSeparatorIndex + 3);

		// 查找 host 和 path 的分隔符
		const hostSeparatorIndex = rest.indexOf(':');
		if (hostSeparatorIndex === -1) {
			// 如果没有 host 分隔符，说明格式不正确，或者 host 就是全部
			return result;
		}
		result.host = rest.substring(0, hostSeparatorIndex);

		// 3. 查找 path 和查询参数的分隔符
		const pathAndQuery = rest.substring(hostSeparatorIndex + 1);
		const querySeparatorIndex = pathAndQuery.indexOf('?');

		if (querySeparatorIndex !== -1) {
			result.path = pathAndQuery.substring(0, querySeparatorIndex);
		} else {
			result.path = pathAndQuery;
		}

		if (querySeparatorIndex >= 0) {
			const filterIndex = uri.indexOf('filter=', querySeparatorIndex + 1);
			const end = uri.indexOf('&', filterIndex);
			const filter = uri.substring(
				filterIndex + 'filter='.length,
				end === -1 ? uri.length : end
			);
			if (filter) {
				result.filter = filter;
			}
		}
	}

	return result;
}

/**
 * 判断字符串是否是一个有效的对象属性路径
 * @param {string} path 待验证的路径字符串
 * @returns {boolean}
 */
function isValidObjectPath(path: any): boolean {
	if (typeof path !== 'string' || path.length === 0) {
		return false;
	}
	// 正则表达式解释：
	// ^                         匹配字符串的开始
	// [a-zA-Z_$]                匹配路径的第一个字符，必须是字母、$ 或 _
	// [a-zA-Z0-9_$]* 匹配路径的后续字符，可以是字母、数字、$ 或 _ (零个或多个)
	// ( ... )* 这是一个分组，用于匹配路径的后续部分，可以重复零次或多次
	//   \.                      匹配 . 后面跟着
	//   [a-zA-Z_$][a-zA-Z0-9_$]* 一个有效的属性名
	//   |                       或者
	//   \[\d+\]                 匹配中括号中的数字
	//   |                       或者
	//   \[['"][^'"]*['"]\]      匹配中括号中的单引号或双引号字符串
	// $                         匹配字符串的结尾
	const regex =
		/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*|\[\d+]|\[['"][^'"]*['"]])*$/;

	return regex.test(path);
}

export function useDataSourceConfig() {
	const dataSourceSchemaRef = ref<NormalizeDataSource>({
		schema: 'object',
		host: '',
		path: '',
		filter: ''
	});

	const schemaOptions = computed(() => DATA_SOURCE_SCHEMAS);

	const hostOptions = ref<
		{
			value: string;
			label: string;
		}[]
	>([]);

	function updateHostOptions(schema: string): void {
		switch (schema) {
			case 'object':
				hostOptions.value = DATA_SOURCE_OBJECT_SCHEMA_HOST;
				break;
			case 'http':
				hostOptions.value = DATA_SOURCE_HTTP_SCHEMA_HOST;
				break;
			default: {
				hostOptions.value = [];
			}
		}
	}

	function onSchemaChanged(value: string) {
		dataSourceSchemaRef.value.host = '';
		updateHostOptions(value);

		if (hostOptions.value.length === 1 && !dataSourceSchemaRef.value.host) {
			dataSourceSchemaRef.value.host = hostOptions.value[0].value;
		}
	}

	function itemKeyGetter(item: Record<any, any>): string {
		return item.prop as string;
	}

	function reset() {
		dataSourceSchemaRef.value = {
			schema: 'object',
			host: '',
			path: '',
			filter: ''
		};
		onSchemaChanged(dataSourceSchemaRef.value.schema);
	}

	const formSchema = computed(function () {
		return [
			{
				type: NSelect,
				prop: 'schema',
				label: '协议',
				config: {
					options: schemaOptions.value
				},
				rules: [
					{
						required: true,
						message: '选择协议'
					}
				],
				on: {
					'update:value': onSchemaChanged
				}
			},
			{
				type: NSelect,
				prop: 'host',
				label: '访问资源',
				config: {
					options: hostOptions.value
				},
				rules: [
					{
						required: hostOptions.value.length > 0,
						message: '选择访问资源'
					}
				]
			},
			{
				type: NInput,
				prop: 'path',
				label: '路径',
				config: {
					showCount: true,
					maxlength: 1024,
					type: 'textarea'
				},
				rules: [
					{
						validator: function (
							_rule: FormItemRule,
							value: string,
							callback: (e?: Error) => void
						) {
							const end = value.indexOf('?');
							const pathPart = value
								? value.substring(0, end >= 0 ? end : value.length)
								: '';
							if (!pathPart) {
								callback(new Error('填写对象路径'));
								return;
							} else if (
								['object'].includes(dataSourceSchemaRef.value.host) &&
								!isValidObjectPath(pathPart)
							) {
								callback(new Error('路径须符合有效的对象属性路径'));
								return;
							}
							callback();
						}
					}
				],
				span: 2
			},
			{
				type: FunctionCodeSelect,
				prop: 'filter',
				label: '过滤器',
				span: 2
			}
		];
	});

	onMounted(() => {
		updateHostOptions(dataSourceSchemaRef.value.schema);
	});

	watch(() => dataSourceSchemaRef.value.schema, updateHostOptions);

	return {
		dataSourceSchemaRef,
		formSchema,
		itemKeyGetter,
		reset
	};
}
