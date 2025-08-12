// 组件区定义
export type ComponentDefinition = {
    type: string;
    label?: string;
    description?: string;
    props?: Record<string, any>; // 默认属性，被渲染定义继承
};