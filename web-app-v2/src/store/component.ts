import { defineStore } from 'pinia';
import {
	LinkSquare24Regular,
	TextField20Regular,
	Timer24Regular,
	AppsList24Regular,
	TextNumberListLtr24Regular,
	Box24Regular,
	FormNew24Regular,
	TrayItemAdd24Regular,
	Grid24Regular,
	DrawText24Regular,
	Image24Regular
} from '@vicons/fluent';
import { v4 as uuid } from 'uuid';
import type { ComponentDefinition, RendererItemDefinition } from '../types';
import { SequenceGenerator } from '../components/put/common/seq';

const seqGenerator = new SequenceGenerator({
	startFrom: Math.floor(Math.random() * 1000)
});

export function generateComponentId(name: string): string {
	return `${name}_${uuid()}`;
}

export function generateComponentPath(name: string): string {
	return `${name}${seqGenerator.next()}`;
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
		case 'page': {
			return {
				type: 'page',
				id: generateComponentId('page'),
				props: {
					path: generateComponentPath('page'),
					background: '#eee'
				}
			};
		}
		case 'form': {
			return {
				type: 'form',
				id: generateComponentId('form'),
				props: {
					path: generateComponentPath('form'),
					requireMarkPlacement: 'left'
				},
				children: [
					createRendererItemConfig({
						type: 'container'
					})
				]
			};
		}
		case 'formItem': {
			return {
				type: 'formItem',
				id: generateComponentId('formItem'),
				props: {
					label: '表单项',
					path: generateComponentPath('formItem')
				},
				children: [
					createRendererItemConfig({
						type: 'container'
					})
				]
			};
		}
		case 'grid': {
			return {
				type: 'grid',
				id: generateComponentId('grid'),
				props: {
					cols: 4,
					rows: 1,
					xGap: 12,
					yGap: 0
				},
				children: [
					createRendererItemConfig({
						type: 'container'
					}),
					createRendererItemConfig({
						type: 'container'
					}),
					createRendererItemConfig({
						type: 'container'
					}),
					createRendererItemConfig({
						type: 'container'
					})
				]
			};
		}
		case 'textInput': {
			return {
				type: 'textInput',
				id: generateComponentId('textInput'),
				props: {
					path: generateComponentPath('textInput'),
					placeholder: '',
					type: 'text',
					rows: 2,
					maxlength: 255
				}
			};
		}
		case 'datePicker':
			return {
				type: 'datePicker',
				id: generateComponentId('datePicker'),
				props: {
					path: generateComponentPath('datePicker'),
					placeholder: '',
					type: 'date'
				}
			};
		case 'container':
			return {
				type: 'container',
				id: generateComponentId('container'),
				props: {
					style: {
						display: 'flex',
						flexDirection: 'column'
					}
				},
				children: []
			};
		case 'linearList':
			return {
				type: 'linearList',
				id: generateComponentId('linearList'),
				props: {
					path: generateComponentPath('linearList'),
					static: true,
					loop: [],
					dataSource: null,
					slots: {}
				},
				children: [
					createRendererItemConfig({
						type: 'container'
					})
				]
			};
		case 'list':
			// 固定排版的线性表
			return {
				type: 'list',
				id: generateComponentId('list'),
				props: {
					path: generateComponentPath('list'),
					static: true,
					loop: [],
					dataSource: null,
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
		case 'ellipsis': {
			return {
				type: 'ellipsis',
				id: generateComponentId('ellipsis'),
				props: {
					text: '文本'
				}
			};
		}
		case 'image': {
			return {
				type: 'image',
				id: generateComponentId('image'),
				props: {
					src: 'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxnIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0xNCA3LjVhMS41IDEuNSAwIDEgMS0zIDBhMS41IDEuNSAwIDAgMSAzIDB6bS0xIDBhLjUuNSAwIDEgMC0xIDBhLjUuNSAwIDAgMCAxIDB6TTMgNmEzIDMgMCAwIDEgMy0zaDhhMyAzIDAgMCAxIDMgM3Y4YTMgMyAwIDAgMS0zIDNINmEzIDMgMCAwIDEtMy0zVjZ6bTMtMmEyIDIgMCAwIDAtMiAydjhjMCAuMzczLjEwMi43MjIuMjggMS4wMmw0LjY2OS00LjU4OGExLjUgMS41IDAgMCAxIDIuMTAyIDBsNC42NyA0LjU4OEExLjk5IDEuOTkgMCAwIDAgMTYgMTRWNmEyIDIgMCAwIDAtMi0ySDZ6bTAgMTJoOGMuMzcgMCAuNzE1LS4xIDEuMDEyLS4yNzRsLTQuNjYyLTQuNThhLjUuNSAwIDAgMC0uNyAwbC00LjY2MiA0LjU4QTEuOTkgMS45OSAwIDAgMCA2IDE2eiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9nPjwvc3ZnPg==',
					width: 100,
					height: 100
				}
			};
		}
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
		case 'form':
			return FormNew24Regular;
		case 'formItem':
			return TrayItemAdd24Regular;
		case 'grid':
			return Grid24Regular;
		case 'ellipsis':
			return DrawText24Regular;
		case 'image':
			return Image24Regular;
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
						},
						{
							type: 'form',
							label: '表单'
						},
						{
							type: 'formItem',
							label: '表单项'
						}
					]
				},
				{
					groupName: '通用组件',
					groupId: 'common',
					components: [
						{
							type: 'ellipsis',
							label: '文本'
						},
						{
							type: 'image',
							label: '图像'
						}
					]
				},
				{
					groupName: '布局组件',
					groupId: 'layout',
					components: [
						{
							type: 'container',
							label: '容器'
						},
						{
							type: 'grid',
							label: '栅格'
						},
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
