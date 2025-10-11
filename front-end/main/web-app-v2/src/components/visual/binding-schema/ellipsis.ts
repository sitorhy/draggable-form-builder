import { NInput, NInputNumber, NSelect } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';
import SizePropertyInput from '../SizePropertyInput.vue';
import {
	getContainerStyleProp,
	type PropertyFormItemSchemaOptions,
	updateContainerStyle
} from './common.ts';
import { FONTS, WHITE_SPACE_OPTIONS } from '../../put/common/constants.ts';
import SchemaBindingEditor from '../SchemaBindingEditor.vue';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '字段绑定',
				id: 'binding',
				schema: [
					{
						type: SchemaBindingEditor,
						prop: '$binding',
						label: '',
						config: {
							schema: options.schema,
							value: undefined,
							'update:value': function () {
								// ignore
							}
						},
						formItemProps: {
							labelPlacement: 'left'
						}
					}
				]
			},
			{
				title: '文本模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'text',
						label: '内容',
						config: {
							placeholder: '',
							clearable: true,
							type: 'textarea',
							rows: 5
						},
						formItemProps: {
							useBinding: false
						}
					},
					{
						type: NInputNumber,
						prop: 'lineClamp',
						label: '最大行数',
						config: {
							placeholder: '',
							clearable: true
						}
					},
					{
						type: SizePropertyInput,
						prop: 'fontSize',
						label: '字号',
						config: {
							value: getContainerStyleProp(options.schema, 'fontSize')
						},
						on: {
							'update:value': function (fontSize: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										fontSize
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'fontFamily',
						label: '字体',
						config: {
							options: FONTS,
							value: getContainerStyleProp(options.schema, 'fontFamily')
						},
						on: {
							'update:value': function (fontFamily: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										fontFamily
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'whiteSpace',
						label: '空白字符控制',
						config: {
							options: WHITE_SPACE_OPTIONS,
							value: getContainerStyleProp(options.schema, 'whiteSpace')
						},
						on: {
							'update:value': function (whiteSpace: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										whiteSpace
									});
								}
							}
						}
					},
					{
						type: NInputNumber,
						prop: 'lineHeight',
						label: '行高',
						config: {
							placeholder: '',
							clearable: true
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
