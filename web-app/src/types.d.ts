export type RendererLayout = {
    id: string;
    type: string;
    description?: string;
    children?: RendererLayout[]; // 一般是拖动区域专用属性，渲染组件可以不实现
    isLeaf?: boolean; // 是否叶子节点控件
    props?: Record<string, any>; // 渲染组件属性
}

export type ComponentDefinition = {
    type: string;
    label: string;
    isLeaf: boolean;
    description?: string;
    props?: Record<string, any>;
};