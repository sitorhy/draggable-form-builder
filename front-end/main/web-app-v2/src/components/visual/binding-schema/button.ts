import { NSelect } from 'naive-ui';
import {
	getContainerStyleProp,
	type PropertyFormItemSchemaOptions,
	updateContainerStyle
} from './common.ts';
import type { SectionsReturnType } from './index.ts';
import SizePropertyInput from '../SizePropertyInput.vue';
import { BUTTON_TYPE_OPTIONS } from '../../put/common/constants.ts';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '按钮样式',
				id: 'props',
				schema: [
					{
						type: NSelect,
						prop: 'type',
						label: '类型',
						config: {
							options: BUTTON_TYPE_OPTIONS
						}
					},
					{
						type: SizePropertyInput,
						prop: 'width',
						label: '固定宽度',
						config: {
							value: getContainerStyleProp(options.schema, 'width')
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
					},
					{
						type: SizePropertyInput,
						prop: 'height',
						label: '固定高度',
						config: {
							value: getContainerStyleProp(options.schema, 'height')
						},
						on: {
							'update:value': function (height: string | number) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										height
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
		formProps: {},
		events: [
			{
				label: 'click',
				value: 'click'
			}
		]
	};
}
