import PropertyFormItem from '../../put/data/PropertyFormItem.vue';
import { type FormItemRule, NInput } from 'naive-ui';

/**
 * 快速判断字符串是否为有效的 ASCII 变量名
 * @param {string} str
 * @returns {boolean}
 */
export function isValidAsciiVariableName(str: string): boolean {
	// 变量名必须以字母、下划线或 $ 符号开头，
	// 后面可以跟字母、数字、下划线或 $ 符号
	const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
	return regex.test(str);
}

export function useRequiredInputSchema(
	propertyName: string,
	message: string = '',
	validator: (
		_rule: FormItemRule,
		value: string,
		callback: (e?: Error) => void
	) => void
) {
	return {
		type: PropertyFormItem,
		prop: propertyName,
		label: '对象路径',
		config: {
			component: NInput,
			prop: propertyName,
			message: message,
			validator: validator
		},
		rules: [
			{
				required: true
			}
		]
	};
}

export function useBindingPathSchema() {
	return useRequiredInputSchema(
		'path',
		'',
		function (
			_rule: FormItemRule,
			value: string,
			callback: (e?: Error) => void
		) {
			if (!value) {
				callback(new Error('填写节点路径'));
				return;
			} else if (!isValidAsciiVariableName(value)) {
				callback(new Error('路径节点需符合变量定义'));
				return;
			}
			callback();
		}
	);
}
