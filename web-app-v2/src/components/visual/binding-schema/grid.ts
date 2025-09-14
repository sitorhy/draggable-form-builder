import { NInputNumber } from 'naive-ui';
import type { PropertyFormItemSchemaOptions } from './common.ts';
import type { RendererItemDefinition } from '../../../types.ts';
import { createRendererItemConfig } from '../../../store/component.ts';

function updateCells(schema: RendererItemDefinition) {
	if (!schema.props) {
		schema.props = {};
	}
	const props = schema.props;
	if (!props.cols) {
		props.cols = 1;
	}
	if (!props.rows) {
		props.rows = 1;
	}
	const size = props.cols * props.rows;
	if (Number.isSafeInteger(size)) {
		if (!schema.children) {
			schema.children = [];
		}
		while (schema.children.length < size) {
			schema.children.push(
				createRendererItemConfig({
					type: 'container'
				})
			);
		}
		if (schema.children.length > size) {
			const removeSection = schema.children.slice(size);
			const cellChildren = removeSection.reduce(
				(s: RendererItemDefinition[], i) => {
					if (Array.isArray(i.children) && i.children.length > 0) {
						return [...s, ...i.children];
					}
					return s;
				},
				[]
			);
			schema.children.splice(size, schema.children.length - size + 1);
			if (schema.children.length > 0) {
				const lastChild = schema.children[schema.children.length - 1];
				if (lastChild) {
					if (!lastChild.children) {
						lastChild.children = [];
					}
					lastChild.children.push(...cellChildren);
				}
			}
		}
	}
}

function sections(options: PropertyFormItemSchemaOptions) {
	return {
		sections: [
			{
				title: '栅格模式',
				id: 'props',
				schema: [
					{
						type: NInputNumber,
						prop: 'cols',
						label: '列数',
						config: {
							min: 1,
							max: 24
						},
						on: {
							'update:value': function (cols: number) {
								if (options.schema) {
									options.schema.props = {
										...options.schema.props,
										cols
									};
									updateCells(options.schema);
								}
							}
						}
					},
					{
						type: NInputNumber,
						prop: 'rows',
						label: '行数',
						config: {
							min: 1,
							max: 128
						},
						on: {
							'update:value': function (rows: number) {
								if (options.schema) {
									options.schema.props = {
										...options.schema.props,
										rows
									};
									updateCells(options.schema);
								}
							}
						}
					},
					{
						type: NInputNumber,
						prop: 'xGap',
						label: '横向间隔',
						config: {
							min: 0,
							max: 128
						}
					},
					{
						type: NInputNumber,
						prop: 'yGap',
						label: '纵向间隔',
						config: {
							min: 0,
							max: 128
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
