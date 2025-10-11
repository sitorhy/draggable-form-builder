import { NInput } from 'naive-ui';
import type { SectionsReturnType } from './index.ts';
import SizePropertyInput from '../SizePropertyInput.vue';
import {
	getContainerStyleProp,
	type PropertyFormItemSchemaOptions,
	updateContainerStyle
} from './common.ts';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '公式模式',
				id: 'props',
				schema: [
					{
						type: NInput,
						prop: 'katex',
						label: 'Katex公式配置',
						config: {
							placeholder: '',
							clearable: true,
							type: 'textarea',
							rows: 5
						},
						formItemProps: {
							useBinding: true
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
