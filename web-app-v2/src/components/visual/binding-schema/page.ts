import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common';
import { NSelect, NColorPicker } from 'naive-ui';
import { PAGE_DIRECTION, PAGE_FORMAT } from '../../put/common/constants.ts';

function sections(options: PropertyFormItemSchemaOptions) {
	return {
		sections: [
			{
				title: '页面模式',
				id: 'props',
				schema: [
					useBindingPathSchema(options),
					{
						type: NSelect,
						prop: 'format',
						label: '尺寸',
						config: {
							placeholder: '',
							clearable: true,
							options: PAGE_FORMAT
						}
					},
					{
						type: NSelect,
						prop: 'direction',
						label: '方向',
						config: {
							placeholder: '',
							clearable: true,
							options: PAGE_DIRECTION
						}
					}
				]
			},
			{
				title: '辅助属性',
				id: 'design',
				schema: [
					{
						type: NColorPicker,
						prop: 'background',
						label: '背景内容',
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
