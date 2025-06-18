import {useRendererStore} from "../store.ts";
import {findNodeById, findParentByNodeId, insertBefore, insertBeforeId, insertBeforeIndex, moveTo} from "./node.ts";

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