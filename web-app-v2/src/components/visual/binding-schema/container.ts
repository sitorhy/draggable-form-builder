import { NSelect } from 'naive-ui';
import EdgeProperties from '../EdgeProperties.vue';
import type { PropertyFormItemSchemaOptions } from './common.ts';
import type { RendererItemDefinition } from '../../../types.ts';
import type { SectionsReturnType } from './index.ts';

function updateContainerStyle(
	schema: RendererItemDefinition,
	style: Record<string, any>
) {
	if (!schema.props) {
		schema.props = {};
	}

	if (!schema.props.style) {
		schema.props.style = {};
	}

	schema.props.style = {
		...schema.props.style,
		...style
	};
}

function sections(options: PropertyFormItemSchemaOptions): SectionsReturnType {
	return {
		sections: [
			{
				title: '容器样式',
				id: 'props',
				schema: [
					{
						type: EdgeProperties,
						label: '内边距',
						prop: 'padding',
						config: {
							left: options.schema?.props?.style?.paddingLeft,
							right: options.schema?.props?.style?.paddingRight,
							top: options.schema?.props?.style?.paddingTop,
							bottom: options.schema?.props?.style?.paddingBottom
						},
						on: {
							'update:left': function (paddingLeft: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										paddingLeft
									});
								}
							},
							'update:right': function (paddingRight: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										paddingRight
									});
								}
							},
							'update:top': function (paddingTop: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										paddingTop
									});
								}
							},
							'update:bottom': function (paddingBottom: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										paddingBottom
									});
								}
							}
						}
					},
					{
						type: EdgeProperties,
						label: '外边距',
						prop: 'margin',
						config: {
							left: options.schema?.props?.style?.marginLeft,
							right: options.schema?.props?.style?.marginRight,
							top: options.schema?.props?.style?.marginTop,
							bottom: options.schema?.props?.style?.marginBottom
						},
						on: {
							'update:left': function (marginLeft: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										marginLeft
									});
								}
							},
							'update:right': function (marginRight: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										marginRight
									});
								}
							},
							'update:top': function (marginTop: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										marginTop
									});
								}
							},
							'update:bottom': function (marginBottom: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										marginBottom
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'display',
						label: '布局类型',
						config: {
							disabled: false,
							value: 'flex',
							options: [
								{
									label: '弹性布局',
									value: options.schema?.props?.style?.display
								}
							]
						},
						on: {
							'update:value': function (display: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										display
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'flexDirection',
						label: '主轴方向',
						config: {
							value: options.schema?.props?.style?.flexDirection,
							options: [
								{
									value: 'column',
									label: '垂直'
								},
								{
									value: 'row',
									label: '水平'
								}
							]
						},
						on: {
							'update:value': function (flexDirection: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										flexDirection
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'justifyContent',
						label: '主轴对齐',
						config: {
							value: options.schema?.props?.style?.justifyContent,
							options: [
								{
									value: 'stretch',
									label: '拉伸'
								},
								{
									value: 'flex-start',
									label: '起点'
								},
								{
									value: 'flex-end',
									label: '终点'
								},
								{
									value: 'center',
									label: '居中'
								}
							]
						},
						on: {
							'update:value': function (justifyContent: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										justifyContent
									});
								}
							}
						}
					},
					{
						type: NSelect,
						prop: 'alignItems',
						label: '交叉轴对齐',
						config: {
							value: options.schema?.props?.style?.alignItems,
							options: [
								{
									value: 'stretch',
									label: '拉伸'
								},
								{
									value: 'flex-start',
									label: '起点'
								},
								{
									value: 'flex-end',
									label: '终点'
								},
								{
									value: 'center',
									label: '居中'
								}
							]
						},
						on: {
							'update:value': function (alignItems: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										alignItems
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
