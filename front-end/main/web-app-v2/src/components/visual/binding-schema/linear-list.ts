import type { SectionsReturnType } from './index.ts';
import { NSwitch } from 'naive-ui';
import JsonEditorModal from '../JsonEditorModal.vue';
import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common.ts';
import DataSourceSchema from '../DataSourceSchema.vue';

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '线性表模式',
				id: 'props',
				schema: [useBindingPathSchema()]
			},
			{
				title: '绑定模式',
				id: 'dataSourceSetting',
				schema: [
					{
						type: NSwitch,
						prop: 'static',
						label: '使用静态数据'
					},
					{
						type: JsonEditorModal,
						prop: 'loop',
						// 应始终使用数组
						label: '静态数据',
						config: {
							readOnly: !options.schema?.props?.static
						}
					},
					{
						type: DataSourceSchema,
						prop: 'datasource',
						label: '数据源',
						config: {
							readOnly: options.schema?.props?.static
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
