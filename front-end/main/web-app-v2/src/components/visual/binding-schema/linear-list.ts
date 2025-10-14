import type { SectionsReturnType } from './index.ts';
import { NSwitch } from 'naive-ui';
import JsonEditorModal from '../JsonEditorModal.vue';
import {
	type PropertyFormItemSchemaOptions,
	useBindingPathSchema
} from './common.ts';
import DataSourceSchema from '../DataSourceSchema.vue';
import type { NormalizeDataSource } from '../../../types.ts';
import { stringifyDataSourceSchema } from '../data-source/config.ts';

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
						label: '使用静态数据',
						on: {
							'update:value': function (value: any) {
								if (value) {
									if (options.schema?.props) {
										options.schema.props.dataSource = null;
									}
								}
							}
						}
					},
					{
						type: JsonEditorModal,
						prop: 'loop',
						// 应始终使用数组
						label: '静态数据',
						config: {
							readOnly: !options.schema?.props?.static,
							isArray: true
						}
					},
					{
						type: DataSourceSchema,
						prop: 'dataSource',
						label: '数据源',
						config: {
							readOnly: options.schema?.props?.static,
							value: options.schema?.props?.dataSource
								? options.schema?.props?.dataSource
								: null
						},
						on: {
							'update:value': function (
								schema: string | NormalizeDataSource | undefined
							) {
								if (options.schema && schema) {
									if (typeof schema === 'string') {
										options.schema.props = {
											...options.schema.props,
											dataSource: schema
										};
									} else {
										options.schema.props = {
											...options.schema.props,
											dataSource: stringifyDataSourceSchema(
												schema as NormalizeDataSource
											)
										};
									}
								} else {
									if (options.schema) {
										options.schema.props = {
											...options.schema.props,
											dataSource: null
										};
									}
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
