export type RendererLayout = {
    id: string;
    type: string;
    description?: string;
    children?: RendererLayout[];
    isLeaf?: boolean; // 是否叶子节点控件
}