import { NInput, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { TEXT_INPUT_TYPE } from '../../put/common/constants.ts';
import {
	type PropertyFormItemSchemaOptions,
	updateContainerStyle,
	useBindingPathSchema
} from './common.ts';
import type { SectionsReturnType } from './index.ts';
import SizePropertyInput from '../SizePropertyInput.vue';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '文本输入模式',
				id: 'props',
				schema: [
					useBindingPathSchema(),
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
					},
					{
						type: SizePropertyInput,
						prop: 'width',
						label: '固定宽度',
						config: {
							value: options.schema?.props?.style?.width
						},
						on: {
							'update:value': function (width: string | number) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										width
									});
								}
							}
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
