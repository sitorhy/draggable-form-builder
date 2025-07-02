import {useRendererStore} from "../store.ts";
import {v4 as uuid} from "uuid"
import {findNodeById, findParentByNodeId, insertBefore, insertBeforeId, insertBeforeIndex, moveTo} from "./node.ts";
import type {ComponentDefinition, RendererLayout} from "../types";
import {
    NumberRow16Regular,
    SelectAllOn24Regular,
    SlideGrid24Regular,
    TextField20Regular,
    Timer24Regular
} from "@vicons/fluent";
import {Components} from "@vicons/tabler";

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
        ["gridCell", "栅格-列"]
    ]);

    return map.get(type) || "Unknown";
}

export function useRendererActions() {
    const store = useRendererStore();

    return {
        getActiveRendererItemInfo: () => store.activeRendererItemInfo,
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
                type: "grid",
                id: uuid(),
                children: [],
                outline: {
                    setting: true,
                },
            };

            const props = Object.assign({
                cols: 4, // 默认4列
                rows: 1,
            }, componentDefinition.props);

            rendererLayout.props = props;

            for (let i = 0; i < props.cols * props.rows; i++) {
                rendererLayout.children.push({
                    type: "gridCell",
                    id: uuid(),
                    children: [],
                    props: {},
                });
            }

            return rendererLayout;
        }
        case "textInput": {
            return {
                type: "textInput",
                id: uuid(),
                props: {
                    placeholder: "",
                    type: "text",
                    rows: 2,
                },
                outline: {
                    setting: true,
                },
                tooltip: {
                    setting: true,
                },
            };
        }
        case "textNumberInput": {
            return {
                type: "textNumberInput",
                id: uuid(),
                props: {
                    placeholder: "",
                },
                outline: {
                    setting: true,
                },
                tooltip: {
                    setting: true,
                },
            };
        }
        case "datePicker":
            return {
                type: "datePicker",
                id: uuid(),
                props: {
                    placeholder: "",
                    type: "date",
                },
                outline: {
                    setting: true,
                },
                tooltip: {
                    setting: true,
                },
            };
        case 'select':
            return {
                type: "select",
                id: uuid(),
                props: {
                    path: "value",
                    placeholder: "",
                    options: [],
                },
                outline: {
                    setting: true,
                },
                tooltip: {
                    setting: true,
                },
            };
    }

    return Object.assign(
        {
            id: uuid(),
            type: componentDefinition.type,
        }, omit(
            {
                description: componentDefinition.description,
                props: {},
            }
        )
    );
}

export function getIconByType(type: string) {
    switch (type) {
        case 'textInput':
            return TextField20Regular;
        case 'textNumberInput':
            return NumberRow16Regular;
        case 'datePicker':
            return Timer24Regular;
        case 'select':
            return SelectAllOn24Regular;
        case 'grid':
            return SlideGrid24Regular;
        default:
            return Components;
    }
}