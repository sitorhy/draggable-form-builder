import { NInput, NSelect, NSwitch } from 'naive-ui';
import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common.ts';

const DATE_TYPE_OPTIONS = [
	{
		label: '日期',
		value: 'date'
	},
	{
		label: '日期时间',
		value: 'datetime'
	},
	{
		label: '日期范围',
		value: 'daterange'
	},
	{
		label: '日期时间范围',
		value: 'datetimerange'
	},
	{
		label: '月份',
		value: 'month'
	},
	{
		label: '月份范围',
		value: 'monthrange'
	},
	{
		label: '年份',
		value: 'year'
	},
	{
		label: '年份范围',
		value: 'yearrange'
	},
	{
		label: '季度',
		value: 'quarter'
	},
	{
		label: '季度范围',
		value: 'quarterrange'
	},
	{
		label: '周',
		value: 'week'
	}
];

const DATE_FORMAT = [
	{
		label: 'yyyy/MM/dd',
		value: 'yyyy/MM/dd'
	},
	{
		label: 'yyyy年MM月dd日',
		value: 'yyyy年MM月dd日'
	},
	{
		label: 'yyyy/MM/dd - HH:mm',
		value: 'yyyy/MM/dd - HH:mm'
	},
	{
		label: 'yyyy年MM月dd日 - HH:mm',
		value: 'yyyy年MM月dd日 - HH:mm'
	},
	{
		label: 'yyyy年MM月dd日 HH:mm:ss',
		value: 'yyyy年MM月dd日 HH:mm:ss'
	}
];

function sections(options: PropertyFormItemSchemaOptions) {
	return {
		sections: [
			{
				title: '日期模式',
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
						type: NSelect,
						prop: 'type',
						label: '日期类型',
						config: {
							placeholder: '',
							options: DATE_TYPE_OPTIONS
						}
					},
					{
						type: NSelect,
						prop: 'format',
						label: '日期格式',
						config: {
							placeholder: '',
							options: DATE_FORMAT
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
