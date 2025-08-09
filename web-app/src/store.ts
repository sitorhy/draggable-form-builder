import {defineStore} from "pinia";
import {findAncestorsByNodeId, findNodeById, findParentByNodeId} from "./common/node.ts";
import type {ActiveRendererItemInfo, Datasource, FunctionCode, RendererLayout} from "./types";
import {ESMLoader} from './common/esm-loader.ts'
import * as dotProp from "dot-prop";
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
                        }
                    ]
                },
                {
                    groupName: '高级组件',
                    groupId: 'advanced',
                    components: [
                        {
                            type: 'bindingObject',
                            label: '对象绑定',
                        }
                    ]
                }
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
    loadDatasource(datasource: Partial<Datasource>, data?: any): Promise<any>;
    loadDatasourceById(id: string, data?: any): Promise<any>;
}>('datasource', {
    state() {
        return {
            datasource: [
                {
                    id: uuid(),
                    isStatic: true,
                    name: '图片对象',
                    description: '属性imageUrl',
                    feature: 'other',
                    mock: JSON.stringify({
                        imageUrl: 'https://www.naiveui.com/assets/naivelogo-BdDVTUmz.svg'
                    }),
                },
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
        loadDatasource: async function (datasource: Partial<Datasource>, data?: any): Promise<any> {
            if (datasource.isStatic) {
                return JSON.parse(datasource.mock as string);
            } else {
                const response = await fetch(datasource.url as string, {
                    method: datasource.method,
                    body: data ? JSON.stringify(data) : undefined
                });
                return await response.json();
            }
        },
        loadDatasourceById: async function (id: string, data?: any): Promise<any> {
            const datasource = await this.findDatasourceById(id);
            return await this.loadDatasource(datasource as Datasource, data);
        },
    }
});

export const useFunctionStore = defineStore<"function", {
    functions: FunctionCode[];
    modules: Map<string, any>;
}, {}, {
    getAllFunctionCode: (page: number, size: number) => Promise<{
        total: number;
        page: number;
        size: number;
        data: Partial<FunctionCode>[];
    }>;
    createFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode>;
    findFunctionCodeById(id: string): Promise<FunctionCode | null>;
    updateFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode>;
    loadModule(code: FunctionCode): Promise<any>;
    loadModuleById(id: string): Promise<any>;
}>('function', {
    state() {
        return {
            functions: [
                {
                    id: uuid(),
                    name: '判断简单对象',
                    code: `export default function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false

    let proto = Object.getPrototypeOf(obj)
    if (proto === null) return true
    let baseProto = proto

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto)
    }
    return proto === baseProto;
}
`,
                    feature: 'other'
                },
                {
                    id: uuid(),
                    name: '图片地址判断',
                    code: `export default function (obj) {
    return obj.imageUrl || obj.url || obj.src;
}`,
                    feature: 'other',
                },
                {
                    id: uuid(),
                    name: '图片属性转换',
                    code: `export default function (obj) {
    return { src: obj.imageUrl || obj.url || obj.src };
}`,
                    feature: 'other',
                },
                {
                    id: uuid(),
                    name: '单选问题提取',
                    code: `export default function (data) { return data.options || []; }`,
                    feature: 'select',
                }
            ],
            modules: new Map<string, any>(),
        }
    },
    actions: {
        getAllFunctionCode(page: number, size: number): Promise<{
            total: number;
            page: number;
            size: number;
            data: Partial<FunctionCode>[];
        }> {
            return Promise.resolve({
                data: this.functions.map(i => {
                    return {
                        id: i.id,
                        name: i.name,
                        feature: i.feature,
                        description: i.description,
                    }
                }).slice(Math.min(Math.floor(this.functions.length / size), page - 1), Math.min(Math.floor(this.functions.length / size), page - 1) + size),
                page: Math.min(Math.floor(this.functions.length / size), page - 1) + 1,
                size: size,
                total: this.functions.length
            });
        },
        createFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode> {
            return new Promise<FunctionCode>((resolve, reject) => {
                if (this.functions.findIndex((i) => i.name === (newCode.name || '').trim()) >= 0) {
                    reject(new Error('函数定义已存在'));
                } else {
                    const newId = uuid();
                    const append: FunctionCode = {
                        ...newCode,
                        id: newId
                    } as FunctionCode;
                    this.functions.unshift(append);
                    resolve(append);
                }
            });
        },
        findFunctionCodeById(id: string): Promise<FunctionCode | null> {
            return Promise.resolve(this.functions.find((i) => i.id === id) || null);
        },
        updateFunctionCode(newCode: Partial<FunctionCode>): Promise<FunctionCode> {
            return new Promise<FunctionCode>((resolve, reject) => {
                const index = this.functions.findIndex((i) => i.id === (newCode.id || '').trim());
                if (index < 0) {
                    reject(new Error('函数定义不存在'));
                } else {
                    this.functions.splice(index, 1, {
                        ...(newCode as FunctionCode)
                    });
                    resolve(this.functions[index]);
                }
            });
        },
        async loadModule(code: FunctionCode): Promise<any> {
            if (!code) {
                return null;
            }
            // 查询实例化缓存
            if (this.modules.has(code.id)) {
                return this.modules.get(code.id);
            }
            const module = await ESMLoader(code.code);
            this.modules.set(code.id, module);
            return module;
        },
        async loadModuleById(id: string): Promise<any> {
            if (!id) {
                return null;
            }
            if (this.modules.has(id)) {
                return this.modules.get(id);
            }
            const functionCode = await this.findFunctionCodeById(id);
            if (!functionCode) {
                throw new Error("函数集不存在");
            }
            return await this.loadModule(functionCode as FunctionCode);
        }
    }
});

// 创建动态值绑定（下拉，文本框输入存储），组件属性（静态）不适用该模块
export const useBindingStore = defineStore<"binding", {
    state: Record<string, any>;
    gc: Map<string, number>;
}, {}, {
    cloneBinding(targetPath: string, defaultValue: any, sourcePath?: string): void;
    deleteBinding(path: string): void;
    getDeepKeys(): string[];
    getBinding(path: string): any;
    cloneState(): Record<string, any>;
    replaceState(state: Record<string, any>): void;
}>("binding", {
    state() {
        return {
            state: {},
            gc: new Map<string, number>(),
        };
    },
    actions: {
        cloneState(): Record<string, any> {
            const keys = dotProp.deepKeys(this.state);
            const state: Record<string, any> = {};
            keys.forEach((key) => {
                dotProp.setProperty(state, key, this.getBinding(key));
            });
            return state;
        },
        replaceState(state: Record<string, any>) {
            const keys = dotProp.deepKeys(state);
            keys.forEach((key) => {
                dotProp.setProperty(this.state, key, dotProp.getProperty(state, key, null));
            });
        },
        getBinding(path: string) {
            return dotProp.getProperty(this.state, path, null);
        },
        cloneBinding(targetPath: string, defaultValue: any, sourcePath?: string) {
            try {
                let sourceObj = defaultValue;
                if (sourcePath) {
                    // 切换绑定属性，sourcePath - 删除源属性，复制给目标属性 targetPath
                    // 创建时指定默认值 defaultValue
                    sourceObj = dotProp.getProperty(this.state, sourcePath, defaultValue);
                    dotProp.deleteProperty(this.state, sourcePath);
                }
                dotProp.setProperty(this.state, targetPath, sourceObj);
                this.gc.set(targetPath, (this.gc.get(targetPath) || 0) + 1);
            } catch (e) {
                console.error(e);
                throw e;
            }
        },
        deleteBinding(path: string) {
            try {
                const count = Math.max((this.gc.get(path) || 0) - 1, 0);
                if ((count as number) <= 0) {
                    dotProp.deleteProperty(this.state, path);
                    this.gc.delete(path);
                } else {
                    this.gc.set(path, count);
                }
            } catch (e) {
                console.error(e);
                throw e;
            }
        },
        // 枚举绑定路径
        getDeepKeys() {
            return dotProp.deepKeys(this.state);
        }
    }
});