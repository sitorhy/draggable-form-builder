// 组件区定义
export type ComponentDefinition = {
    type: string;
    label: string;
    description?: string;
    props?: Record<string, any>; // 默认属性，被渲染定义继承
};

// 渲染区定义
export type RendererLayout = {
    id: string;
    type: string;
    description?: string; // 继承组件区定义，可读性属性
    children?: RendererLayout[]; // 一般是拖动区域专用属性，具体渲染组件可以不实现拖动
    props?: Record<string, any>; // 渲染组件属性

    // 大纲视图属性设置
    outline?: {
        // 是否显示设置按钮
        setting: boolean;
    },

    // 渲染区悬浮选项设置
    tooltip?: {
        // 是否显示设置按钮
        setting: boolean;
    }
}

export type ActiveRendererItemInfo = {
    id: string;
    parent: RendererLayout | null;
    ancestors: RendererLayout[];
    config: RendererLayout | null;
}