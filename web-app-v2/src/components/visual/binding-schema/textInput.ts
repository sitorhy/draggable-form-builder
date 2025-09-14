import { NInput, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { TEXT_INPUT_TYPE } from '../../put/common/constants.ts';
import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common.ts';

function sections(options: PropertyFormItemSchemaOptions) {
	return {
		sections: [
			{
				title: '文本输入模式',
				id: 'props',
				schema: [
					useBindingPathSchema(options),
					{
						type: NSwitch,
						prop: 'disabled',
						label: '禁用',
						config: {}
					},
					{
						type: NInput,
						prop: 'placeholder',
						label: '占位信息',
						config: {
							placeholder: ''
						}
					},
					{
						type: NInputNumber,
						prop: 'maxlength',
						label: '最大输入长度',
						config: {
							placeholder: ''
						}
					},
					{
						type: NSelect,
						prop: 'type',
						label: '输入框类型',
						config: {
							options: TEXT_INPUT_TYPE
						}
					},
					{
						type: NInputNumber,
						prop: 'rows',
						label: '文本框行数',
						config: {
							placeholder: ''
						}
					}
				]
			}
		]
	};
}

export default function (options: PropertyFormItemSchemaOptions) {
	return {
		schemas: sections(options),
		formProps: {}
	};
}
