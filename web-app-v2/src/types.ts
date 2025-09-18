// 组件区定义
import type { Component } from 'vue';
import type { FormItemRule } from 'naive-ui';

export type ComponentDefinition = {
	type: string;
	label?: string;
	description?: string;
	props?: Record<string, any>; // 默认属性，被渲染定义继承
};

export type RendererItemDefinition = {
	type: string;
	id: string;
	props?: Record<string, any> & {
		path?: string; // 上下文绑定名称
		slots?: Record<string, RendererItemDefinition>;
	};
	children?: RendererItemDefinition[];
	binding?: Record<string, string>;
};

export type PropertyInjectionSchema = Record<string, any> & {
	type: Component<Record<string, any>> | string;
	label: string;
	prop: string;
	config?: Record<string, any>;
	visible?: () => boolean;
	rules?: FormItemRule[];
	on?: Record<string, (...args: any[]) => any>;
	span?: number | string;
	formItemProps?: Record<string, any>;
};

export type NormalizeDataSource = {
	schema: string;
	host: string;
	path: string;
};
