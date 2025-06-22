import type {RendererLayout} from "../types";

//// 节点操作，参数定义优先使用id

// 搜索节点
export function findNodeById(root: RendererLayout, id: string): RendererLayout | null {
    if (root.id === id) {
        return root;
    }
    if (Array.isArray(root.children) && root.children.length > 0) {
        for (const child of root.children) {
            if (child.id === id) {
                return child;
            }
            const matchFound = findNodeById(child, id);
            if (matchFound) {
                return matchFound;
            }
        }
    }
    return null;
}

// 搜索节点所在集合的父节点
export function findParentByNodeId(root: RendererLayout, id: string): RendererLayout | null {
    if (Array.isArray(root.children) && root.children.length > 0) {
        for (const child of root.children) {
            if (child.id === id) {
                return root;
            }
            const matchParentFound = findParentByNodeId(child, id);
            if (matchParentFound) {
                return matchParentFound;
            }
        }
    }
    return null;
}

function __findAncestorsByNodeId(root: RendererLayout, id: string, receive: RendererLayout[] = []) {
    if (Array.isArray(root.children) && root.children.length > 0) {
        for (const child of root.children) {
            if (child.id === id) {
                receive.unshift(root);
                return true;
            }
            const found = __findAncestorsByNodeId(child, id, receive);
            if (found) {
                receive.unshift(root);
                return true;
            }
        }
    }
    return false;
}

export function findAncestorsByNodeId(root: RendererLayout, id: string): RendererLayout[] {
    const ancestors: RendererLayout[] = [];
    __findAncestorsByNodeId(root, id, ancestors);
    return ancestors;
}

// 获取节点所在集合索引
export function indexOfParent(root: RendererLayout, child: RendererLayout): number {
    if (!Array.isArray(root.children) || !root || !child) {
        return -1;
    }
    return root.children.findIndex(c => c.id === child.id);
}

/**
 * 往集合中插入新节点
 * @param root 父节点，父节点集合为空时，自动创建空集合
 * @param before 插入锚点，传null/undefined，插入末尾
 * @param target 要插入的目标节点
 */
export function insertBefore(root: RendererLayout, before: RendererLayout | null | undefined, target: RendererLayout) {
    if (!Array.isArray(root.children)) {
        root.children = [];
    }
    if (!before) {
        root.children.push(target);
        return;
    }
    let beforeIndex = root.children.length;
    if (before) {
        beforeIndex = indexOfParent(root, before);
        if (beforeIndex < 0) {
            root.children.push(target);
            return;
        }
    }
    insertBeforeIndex(root, beforeIndex, target);
}

export function insertBeforeId(root: RendererLayout, beforeId: string | null | undefined, target: RendererLayout) {
    if (!Array.isArray(root.children)) {
        root.children = [];
    }
    if (!beforeId) {
        root.children.push(target);
        return;
    }
    let beforeIndex = root.children.length;
    if (beforeId) {
        beforeIndex = root.children.findIndex(c => c.id === beforeId);
        if (beforeIndex < 0) {
            root.children.push(target);
            return;
        }
    }
    insertBeforeIndex(root, beforeIndex, target);
}

export function insertBeforeIndex(root: RendererLayout, beforeIndex: number, target: RendererLayout) {
    if (!Array.isArray(root.children)) {
        root.children = [];
    }
    root.children.splice(Math.min(beforeIndex, root.children.length), 0, target);
}

/**
 * 移动节点
 * @param root 容器根节点
 * @param id 节点id
 * @param targetParentId 目标集合父节点
 * @param targetBeforeId 目标集合锚点
 */
export function moveTo(root: RendererLayout, id: string, targetParentId: string, targetBeforeId?: string) {
    const targetParent = findNodeById(root, targetParentId);

    if (!targetParent) {
        throw new Error("Cannot move to empty element");
    }

    const fromParent = findParentByNodeId(root, id);

    if (!fromParent) {
        throw new Error("Dragging element not match specify container");
    }

    const target = (fromParent.children as RendererLayout[]).find(c => c.id === id);
    const fromIndex = indexOfParent(targetParent, {type: "", id: id});
    // 移出，targetParent不为空 => target不为空
    (fromParent.children as RendererLayout[]).splice(fromIndex, 1);

    // 移入
    insertBeforeId(root, targetBeforeId, target as RendererLayout);
}