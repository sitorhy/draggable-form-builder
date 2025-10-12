export type RendererItemDefinition = {
	type: string;
	id: string;
	props?: Record<string, any> & {
		path?: string; // 上下文绑定名称
		slots?: Record<string, RendererItemDefinition>;
	};
	children?: RendererItemDefinition[];
	binding?: Record<string, string>;
    events?: Record<string, string>;
};

export type ProjectDefinition = {
    engine?: string;
	title: string; // 项目标题
	name: string; // 项目标识
	id: string;
	pages: {
		id: string;
		title: string;
		schema?: RendererItemDefinition;
		localFlag?: boolean; // 本地测试用途
	}[];
    functions?: FunctionCode[];
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
