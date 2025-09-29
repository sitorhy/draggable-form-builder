import { NInputNumber, NSelect } from 'naive-ui';
import EdgeProperties from '../EdgeProperties.vue';
import {
	type PropertyFormItemSchemaOptions,
	updateContainerStyle
} from './common.ts';
import type { SectionsReturnType } from './index.ts';
import SizePropertyInput from '../SizePropertyInput.vue';
import {
	FONTS,
	FLEX_WRAP_OPTIONS,
	DISPLAY_OPTIONS,
	JUSTIFY_CONTENT_OPTIONS,
	ALIGN_ITEMS_OPTIONS
} from '../../put/common/constants.ts';

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
							value: options.schema?.props?.style?.display,
							options: DISPLAY_OPTIONS
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
							options: JUSTIFY_CONTENT_OPTIONS
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
							options: ALIGN_ITEMS_OPTIONS
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
					},
					{
						type: NInputNumber,
						prop: 'flex',
						label: '填充权重',
						config: {
							value: options.schema?.props?.style?.flex
						},
						on: {
							'update:value': function (flex: string | number) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										flex
									});
								}
							}
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
					},
					{
						type: SizePropertyInput,
						prop: 'height',
						label: '固定高度',
						config: {
							value: options.schema?.props?.style?.height
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
					},
					{
						type: SizePropertyInput,
						prop: 'fontSize',
						label: '字号',
						config: {
							value: options.schema?.props?.style?.fontSize
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
							value: options.schema?.props?.style?.fontFamily
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
						prop: 'flexWrap',
						label: '换行',
						config: {
							disabled: false,
							value: options.schema?.props?.style?.flexWrap,
							options: FLEX_WRAP_OPTIONS,
							placeholder: ''
						},
						on: {
							'update:value': function (flexWrap: string) {
								if (options.schema) {
									updateContainerStyle(options.schema, {
										flexWrap
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
