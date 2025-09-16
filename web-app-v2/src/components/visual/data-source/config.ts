import { computed, onMounted, ref } from 'vue';
import {
	DATA_SOURCE_OBJECT_SCHEMA_HOST,
	DATA_SOURCE_SCHEMAS
} from '../../put/common/constants.ts';
import { type FormItemRule, NInput, NSelect } from 'naive-ui';
import type { NormalizeDataSource } from '../../../types.ts';

/**
 * 判断字符串是否是一个有效的对象属性路径
 * @param {string} path 待验证的路径字符串
 * @returns {boolean}
 */
function isValidObjectPath(path) {
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

function getQueryString(queryString: string) {
	const params = {};
	if (queryString) {
		const start = queryString.indexOf('?');
		if (start < 0) {
			return params;
		}
		const pairs = queryString.substring(start + 1).split('&');

		for (const pair of pairs) {
			const [key, value] = pair.split('=');
			params[decodeURIComponent(key)] = decodeURIComponent(value);
		}
	}
	return params;
}

export function useDataSourceConfig() {
	const dataSourceSchemaRef = ref<NormalizeDataSource>({
		schema: 'object',
		host: '',
		path: ''
	});

	const schemaOptions = computed(() => DATA_SOURCE_SCHEMAS);

	const hostOptions = ref([]);

	function onSchemaChanged(value: string) {
		dataSourceSchemaRef.value.host = '';
		switch (value) {
			case 'object':
				hostOptions.value = DATA_SOURCE_OBJECT_SCHEMA_HOST;
				break;
			default: {
				hostOptions.value = [];
			}
		}

		if (hostOptions.value.length === 1) {
			dataSourceSchemaRef.value.host = hostOptions.value[0].value;
		}
	}

	const queryStringText = computed(() => {
		const qs = getQueryString(dataSourceSchemaRef.value.path);
		if (qs) {
			return JSON.stringify(qs, null, 2);
		}
		return '';
	});

	function itemKeyGetter(item) {
		return item.prop;
	}

	function reset() {
		dataSourceSchemaRef.value = {
			schema: 'object',
			host: '',
			path: '',
			query: ''
		};
		onSchemaChanged(dataSourceSchemaRef.value.schema);
	}

	const formSchema = computed(() => {
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
						required: true,
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
							} else if (!isValidObjectPath(pathPart)) {
								callback(new Error('路径须符合有效的对象属性路径'));
								return;
							}
							callback();
						}
					}
				]
			},
			{
				type: NInput,
				prop: 'query',
				label: '参数',
				formItemProps: {
					feedback: '仅回显解析'
				},
				config: {
					readonly: true,
					disabled: true,
					value: queryStringText.value,
					type: 'textarea'
				}
			}
		];
	});

	onMounted(() => {
		onSchemaChanged(dataSourceSchemaRef.value.schema);
	});

	function stringifyDataSourceSchema(options: NormalizeDataSource) {
		if (options && options.schema && options.host && options.path) {
			return `${options.schema}://${options.host}:${options.path}`;
		}
		return '';
	}

	return {
		dataSourceSchemaRef,
		formSchema,
		itemKeyGetter,
		stringifyDataSourceSchema,
		isValidObjectPath,
		reset
	};
}
