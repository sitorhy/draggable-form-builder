import { defineStore } from 'pinia';
import {
	LinkSquare24Regular,
	TextField20Regular,
	Timer24Regular,
	AppsList24Regular,
	TextNumberListLtr24Regular,
	Box24Regular
} from '@vicons/fluent';
import { v4 as uuid } from 'uuid';
import type { ComponentDefinition, RendererItemDefinition } from '../types.ts';

export function generateComponentId(name: string): string {
	return `${name}_${uuid()}`;
}

function omit(obj: Record<string, any>) {
	const result: Record<string, any> = {};
	for (const key in obj) {
		if (obj[key] !== undefined) {
			result[key] = obj[key];
		}
	}
	return result;
}

export function createRendererItemConfig(
	componentDefinition: ComponentDefinition
): RendererItemDefinition {
	// 存在props，需要进行额外展开的组件
	switch (componentDefinition.type) {
		case 'textInput': {
			return {
				type: 'textInput',
				id: generateComponentId('textInput'),
				props: {
					placeholder: '',
					type: 'text',
					rows: 2
				}
			};
		}
		case 'datePicker':
			return {
				type: 'datePicker',
				id: generateComponentId('datePicker'),
				props: {
					placeholder: '',
					type: 'date'
				}
			};
		case 'list':
			return {
				type: 'list',
				id: generateComponentId('list'),
				props: {
					loop: [],
					dataSource: '',
					slots: {
						prefix: createRendererItemConfig({
							type: 'container'
						}),
						suffix: createRendererItemConfig({
							type: 'container'
						})
					}
				},
				children: [
					createRendererItemConfig({
						type: 'container'
					})
				]
			};
		case 'container':
			return {
				type: 'container',
				id: generateComponentId('container'),
				props: {},
				children: []
			};
		case 'linearList':
			return {
				type: 'linearList',
				id: generateComponentId('linearList'),
				props: {
					loop: [],
					dataSource: '',
					slots: {}
				}
			};
	}

	return Object.assign(
		{
			id: uuid(),
			type: componentDefinition.type
		},
		omit({
			description: componentDefinition.description,
			props: {}
		})
	);
}

export function getIconByType(type: string) {
	switch (type) {
		case 'textInput':
			return TextField20Regular;
		case 'datePicker':
			return Timer24Regular;
		case 'list':
			return TextNumberListLtr24Regular;
		case 'container':
			return Box24Regular;
		case 'linearList':
			return AppsList24Regular;
		default:
			return LinkSquare24Regular;
	}
}

const componentNamesCache = new Map<string, string>([['page', '页面']]);
function _findLabelByType(
	type: string,
	groups: {
		groupName: string;
		components: {
			type: string;
			label: string;
		}[];
	}[]
): string {
	for (const group of groups) {
		if (Array.isArray(group.components)) {
			for (const comp of group.components) {
				if (comp.type === type) {
					return comp.label;
				}
			}
		}
	}
	return type;
}

export const useComponentsStore = defineStore('components', {
	state() {
		return {
			groups: [
				{
					groupName: '数据录入组件',
					groupId: 'dataInput',
					components: [
						{
							type: 'textInput',
							label: '文本输入'
						},
						{
							type: 'datePicker',
							label: '日期选择器'
						}
					]
				},
				{
					groupName: '布局组件',
					groupId: 'layout',
					components: [
						{
							type: 'list',
							label: '列表'
						}
					]
				},
				{
					groupName: '高阶组件',
					groupId: 'advanced',
					components: [
						{
							type: 'container',
							label: '容器'
						},
						{
							type: 'linearList',
							label: '线性表'
						}
					]
				}
			]
		};
	},
	actions: {
		getComponentNameByType(type: string) {
			if (componentNamesCache.has(type)) {
				return componentNamesCache.get(type);
			}
			const label = _findLabelByType(type, this.groups);
			componentNamesCache.set(type, label);
			return label;
		}
	}
});
