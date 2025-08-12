import {defineStore} from "pinia";
import {
    LinkSquare24Regular,
    TextField20Regular,
    Timer24Regular,
} from "@vicons/fluent";
import {v4 as uuid} from "uuid"
import type {ComponentDefinition} from "../types.ts";

export function generateComponentId(name: string): string {
    return `${name}_${uuid()}`;
}

function omit(obj: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}

export function createRendererItemConfig(componentDefinition: ComponentDefinition) {
    // 存在props，需要进行额外展开的组件
    switch (componentDefinition.type) {
        case "textInput": {
            return {
                type: "textInput",
                id: generateComponentId("textInput"),
                props: {
                    placeholder: "",
                    type: "text",
                    rows: 2,
                },
            };
        }
        case "datePicker":
            return {
                type: "datePicker",
                id: generateComponentId("datePicker"),
                props: {
                    placeholder: "",
                    type: "date",
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
        case 'datePicker':
            return Timer24Regular;
        default:
            return LinkSquare24Regular;
    }
}

export const useComponentsStore = defineStore('components', {
    state() {
        return {
            groups: [
                {
                    groupName: '数据录入组件',
                    groupId: 'dataInput',
                    components: [
                        {
                            type: "textInput",
                            label: '文本输入',
                        },
                        {
                            type: "datePicker",
                            label: '日期选择器',
                        },
                    ]
                },
            ]
        }
    },
});