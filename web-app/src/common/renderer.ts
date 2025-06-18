import {useRendererStore} from "../store.ts";
import {v4 as uuid} from 'uuid';
import {findNodeById, findParentByNodeId, insertBefore, insertBeforeId, insertBeforeIndex, moveTo} from "./node.ts";
import type {ComponentDefinition, RendererLayout} from "../types";

function omit(obj: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}

export function getComponentNameByType(type: string): string {
    const map = new Map([
        ["root", "根容器"],
        ["textInput", "文本输入"],
        ["textNumberInput", "数字输入"],
        ["datePicker", "日期选择器"],
        ["select", "选择器"],
        ["grid", "栅格"],
        ["gridColumn", "栅格-列"]
    ]);

    return map.get(type) || 'Unknown';
}

export function useRendererActions() {
    const store = useRendererStore();

    return {
        findNodeById: (id: string) => findNodeById(store.data, id),
        findParentByNodeId: (id: string) => findParentByNodeId(store.data, id),
        insertBefore,
        insertBeforeId,
        insertBeforeIndex,
        moveTo: (id: string, targetParentId: string, targetBeforeId?: string) => moveTo(store.data, id, targetParentId, targetBeforeId),
    };
}

export function createRendererItemConfig(componentDefinition: ComponentDefinition): RendererLayout {
    // 存在props，需要进行额外展开的组件
    switch (componentDefinition.type) {
        case "grid": {
            const rendererLayout: RendererLayout & Required<Pick<RendererLayout, 'children'>> = {
                type: 'grid',
                id: uuid(),
                isLeaf: false,
                children: [],
            };

            const props = Object.assign({
                cols: 4, // 默认4列
            }, componentDefinition.props);

            rendererLayout.props = props;

            for (let i = 0; i < props.cols; i++) {
                rendererLayout.children.push({
                    type: 'gridColumn',
                    id: uuid(),
                    isLeaf: false,
                    children: [],
                });
            }

            return rendererLayout;
        }
    }

    return Object.assign(
        {
            id: uuid(),
            type: componentDefinition.type,
        }, omit(
            {
                description: componentDefinition.description,

                // children决定是否生成拖动区域， isLeaf控制children生成
                children: componentDefinition.isLeaf ? undefined : [],
                // 暂继承，渲染大纲树图标（目录/组件）
                isLeaf: componentDefinition.isLeaf,
            }
        )
    )
}