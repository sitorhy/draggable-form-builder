import {defineStore} from "pinia";
import {findAncestorsByNodeId, findNodeById, findParentByNodeId} from "./common/node.ts";
import type {ActiveRendererItemInfo, Datasource, RendererLayout} from "./types";
import {v4 as uuid} from "uuid"

export const useComponentsStore = defineStore('components', {
    state() {
        return {
            groups: [
                {
                    groupName: "通用组件",
                    groupId: "common",
                    components: [
                        {
                            type: 'button',
                            label: '按钮',
                        },
                        {
                            type: 'text',
                            label: '文本'
                        },
                        {
                            type: 'image',
                            label: '图片'
                        }
                    ],
                },
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
                        },
                        {
                            type: 'checkboxGroup',
                            label: '复选框组',
                        },
                        {
                            type: 'checkbox',
                            label: '复选框项',
                        },
                        {
                            type: 'radioGroup',
                            label: '单选框组',
                        },
                        {
                            type: 'radio',
                            label: '单选框项',
                        },
                    ]
                },
                {
                    groupName: '布局组件',
                    groupId: 'layout',
                    components: [
                        {
                            type: "grid",
                            label: '栅格',
                        },
                        {
                            type: "container",
                            label: "容器",
                            children: [],
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

export const useDatasourceStore = defineStore<"datasource", {
    datasource: Datasource[];
}, {}, {
    getAllDatasource: (page: number, size: number) => Promise<{
        total: number;
        page: number;
        size: number;
        data: Partial<Datasource>[];
    }>;
    createDatasource(newDatasource: Partial<Datasource>): Promise<Datasource>;
    findDatasourceById(id: string): Promise<Datasource | null>;
    updateDatasource(newDatasource: Partial<Datasource>): Promise<Datasource>;
}>('datasource', {
    state() {
        return {
            datasource: [
                {
                    id: uuid(),
                    isStatic: true,
                    description: '下拉测试数据，不需要指定函数集',
                    name: '下拉测试数据',
                    feature: 'select',
                    mock: JSON.stringify([
                        {
                            label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
                            value: 'song0',
                            disabled: true
                        },
                        {
                            label: 'Drive My Car',
                            value: 'song1'
                        },
                        {
                            label: 'Norwegian Wood',
                            value: 'song2'
                        },
                        {
                            label: 'You Won\'t See',
                            value: 'song3',
                            disabled: true
                        },
                        {
                            label: 'Nowhere Man',
                            value: 'song4'
                        },
                        {
                            label: 'Think For Yourself',
                            value: 'song5'
                        },
                        {
                            label: 'The Word',
                            value: 'song6'
                        },
                        {
                            label: 'Michelle',
                            value: 'song7',
                            disabled: true
                        },
                        {
                            label: 'What goes on',
                            value: 'song8'
                        },
                        {
                            label: 'Girl',
                            value: 'song9'
                        },
                        {
                            label: 'I\'m looking through you',
                            value: 'song10'
                        },
                        {
                            label: 'In My Life',
                            value: 'song11'
                        },
                        {
                            label: 'Wait',
                            value: 'song12'
                        }
                    ], null, 2),
                },
                {
                    id: uuid(),
                    url: '/mock/mock-data.json',
                    isStatic: false,
                    method: 'GET',
                    name: '测试数据集',
                    description: '通用回显数据',
                    mock: JSON.stringify({
                        "name": "John Doe",
                        "age": 30,
                        "address": {
                            "street": "123 Main St",
                            "city": "Anytown",
                            "zip": "12345"
                        },
                        "hobbies": ["reading", "hiking", {"type": "sport", "name": "running"}],
                        "contact": {
                            "email": "john.doe@example.com",
                            "phone": {
                                "home": "555-1234",
                                "work": "555-5678"
                            }
                        },
                        "settings": {},
                        "isActive": true
                    }, null, 2),
                },
                {
                    id: uuid(),
                    url: '/mock/mock-question.json',
                    isStatic: false,
                    method: 'GET',
                    name: '测试问题集',
                    description: '可用于单选测试，需提取options字段',
                    feature: 'radio',
                    mock: JSON.stringify({
                        "question": "样本数据2，8，14，16，20的平均数为",
                        "options": [
                            {
                                "label": "8",
                                "value": "A"
                            },
                            {
                                "label": "9",
                                "value": "B"
                            },
                            {
                                "label": "12",
                                "value": "C"
                            },
                            {
                                "label": "18",
                                "value": "D"
                            }
                        ]
                    }, null, 2),
                }
            ]
        };
    },
    actions: {
        getAllDatasource(page: number, size: number): Promise<{
            total: number;
            page: number;
            size: number;
            data: Partial<Datasource>[];
        }> {
            return Promise.resolve({
                data: this.datasource.map(i => {
                    return {
                        id: i.id,
                        description: i.description,
                        name: i.name,
                        feature: i.feature,
                    }
                }).slice(Math.min(Math.floor(this.datasource.length / size), page - 1), Math.min(Math.floor(this.datasource.length / size), page - 1) + size),
                page: Math.min(Math.floor(this.datasource.length / size), page - 1) + 1,
                size: size,
                total: this.datasource.length
            });
        },
        createDatasource(newDatasource: Partial<Datasource>): Promise<Datasource> {
            return new Promise<Datasource>((resolve, reject) => {
                if (this.datasource.findIndex((i) => i.name === (newDatasource.name || '').trim()) >= 0) {
                    reject(new Error('数据集名称已存在'));
                } else {
                    const newId = uuid();
                    const append: Datasource = {
                        ...newDatasource,
                        id: newId
                    } as Datasource;
                    this.datasource.unshift(append);
                    resolve(append);
                }
            });
        },
        findDatasourceById(id: string): Promise<Datasource | null> {
            return Promise.resolve(this.datasource.find((i) => i.id === id) || null);
        },
        updateDatasource(newDatasource: Partial<Datasource>): Promise<Datasource> {
            return new Promise<Datasource>((resolve, reject) => {
                const index = this.datasource.findIndex((i) => i.id === (newDatasource.id || '').trim());
                if (index < 0) {
                    reject(new Error('数据集不存在'));
                } else {
                    this.datasource.splice(index, 1, {
                        ...(newDatasource as Datasource)
                    });
                    resolve(this.datasource[index]);
                }
            });
        },
    }
});