import { NInput, type FormItemRule } from 'naive-ui';
import PropertyFormItem from '../../put/data/PropertyFormItem.vue';
import { isValidAsciiVariableName } from './common.ts';

function schema() {
	return [
		{
			type: PropertyFormItem,
			prop: 'path',
			label: '对象路径',
			config: {
				component: NInput,
				prop: 'path',
				message: '',
				validator: function (
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
			},
			rules: [
				{
					required: true
				}
			]
		}
	];
}

export default function () {
	return {
		schema: schema(),
		formProps: {}
	};
}
