import {defineStore} from "pinia";
import {findAncestorsByNodeId, findNodeById, findParentByNodeId} from "./common/node.ts";
import type {ActiveRendererItemInfo, RendererLayout} from "./types";

export const useComponentsStore = defineStore('components', {
    state() {
        return {
            groups: [
                {
                    groupName: '数据录入',
                    groupId: 'dataInput',
                    components: [
                        {
                            type: "form",
                            label: "表单"
                        },
                        {
                            type: "formItem",
                            label: "表单项"
                        },
                        {
                            type: "textInput",
                            label: '文本输入',
                        },
                        {
                            type: "textNumberInput",
                            label: '数字输入',
                        },
                        {
                            type: "datePicker",
                            label: '日期选择器',
                        },
                        {
                            type: "select",
                            label: '选择器',
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
                            props: {
                                cols: 4,
                            },
                        },
                        {
                            type: "edgeInsets",
                            label: "边距",
                            props: {

                            }
                        }
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
                config: null,
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
                this.activeRendererItemInfo.config = config;
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