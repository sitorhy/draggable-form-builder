import {defineStore} from "pinia";
import {findAncestorsByNodeId, findNodeById, findParentByNodeId} from "./common/node.ts";
import type {ActiveRendererItemInfo, RendererLayout} from "./types";

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
                            isLeaf: true,
                        },
                        {
                            type: "textNumberInput",
                            label: '数字输入',
                            isLeaf: true,
                        },
                        {
                            type: "datePicker",
                            label: '日期选择器',
                            isLeaf: true,
                        },
                        {
                            type: "select",
                            label: '选择器',
                            isLeaf: true,
                        }
                    ]
                },
                {
                    groupName: '布局组件',
                    groupId: 'layout',
                    components: [
                        {
                            type: "grid",
                            label: '栅格',
                            isLeaf: false,
                            props: {
                                cols: 4,
                            },
                        },
                    ]
                },
            ]
        }
    },
});

export const useRendererStore = defineStore<"renderers", {
    activeRendererItemInfo: ActiveRendererItemInfo;
    data: RendererLayout;
}, {}, {
    setActiveComponent: (id: string) => void;
}>('renderers', {
    state() {
        return {
            activeRendererItemInfo: {
                id: "",
                parent: null,
                ancestors: [],
            },
            data: {
                id: "#",
                type: 'root',
                description: "根容器，有且只有一个子节点",
                children: []
            }
        };
    },
    actions: {
        setActiveComponent(id: string) {
            const config = findNodeById(this.data, id);
            if (config) {
                this.activeRendererItemInfo.id = id || "";
                this.activeRendererItemInfo.parent = findParentByNodeId(this.data, id);
                this.activeRendererItemInfo.ancestors = findAncestorsByNodeId(this.data, id);
                return config;
            }
            this.activeRendererItemInfo.id = "";
            this.activeRendererItemInfo.parent = null;
            this.activeRendererItemInfo.ancestors = [];
        }
    }
});

export const useSettings = defineStore("settings", {
    state() {
        return {
            tabName: "tree",
        };
    },
    actions: {
        switchToPropertiesTab() {
            this.tabName = "properties";
        },
        switchToTab(name: string) {
            this.tabName = name;
        }
    }
});