import { NInput, NSelect } from 'naive-ui';
import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common.ts';
import {
	FORM_LABEL_ALIGN,
	FORM_LABEL_PLACEMENT
} from '../../put/common/constants.ts';

function sections(options: PropertyFormItemSchemaOptions) {
	return {
		sections: [
			{
				title: '表单项模式',
				id: 'props',
				schema: [
					useBindingPathSchema(options),
					{
						type: NInput,
						prop: 'label',
						label: '标签信息',
						config: {
							placeholder: ''
						}
					},
					{
						type: NSelect,
						label: '标签对齐',
						prop: 'labelAlign',
						config: {
							options: FORM_LABEL_ALIGN
						}
					},
					{
						type: NSelect,
						label: '标签位置',
						prop: 'labelPlacement',
						config: {
							options: FORM_LABEL_PLACEMENT
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
