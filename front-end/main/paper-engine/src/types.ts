import type { Component } from 'vue';
type FormItemRule = Partial<{
    required: boolean;
    message: string;
    validator: (rule: Record<string, any>, value: any, callback: (e: Error) => void) => any;
}>;

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

export type ProjectDefinition = {
	title: string; // 项目标题
	name: string; // 项目标识
	id: string;
	pages: {
		id: string;
		title: string;
		schema?: RendererItemDefinition;
		localFlag?: boolean; // 本地测试用途
	}[];
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
	filter?: string;
};

export type FunctionCode = {
	id: string;
	name: string;
	code: string;
	description?: string;
	feature?: string;
};
