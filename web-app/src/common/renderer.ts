import {inject, onBeforeMount, ref, watch} from 'vue';
import {useMessage} from "naive-ui";
import type {MessageReactive} from 'naive-ui';
import {useBindingStore, useRendererStore} from "../store.ts";
import {v4 as uuid} from "uuid"
import {findNodeById, findParentByNodeId, insertBefore, insertBeforeId, insertBeforeIndex, moveTo} from "./node.ts";
import type {ComponentDefinition, RendererLayout} from "../types";
import {
    NumberRow16Regular,
    SelectAllOn24Regular,
    SlideGrid24Regular,
    TextField20Regular,
    Timer24Regular,
    FormNew24Regular,
    AppsList24Regular,
    DocumentMargins24Regular,
    CheckboxChecked24Regular,
    RadioButton24Filled,
    CheckboxUnchecked24Filled,
    RadioButton24Regular,
    ControlButton20Regular,
    TextCaseTitle24Filled,
    Image24Regular
} from "@vicons/fluent";
import {Components} from "@vicons/tabler";

export function generateComponentId(name: string): string {
    return `${name}_${uuid()}`;
}

export function useBindingModel(options?: {
    getInitialValue(): any;
    onChange?: (value: any) => void;
}) {
    const bindingStore = useBindingStore();
    const bindingPath = inject<string>("bindingPath");
    const bindingModel = ref<any>();
    watch(bindingModel, (value: any) => {
        if (bindingPath) {
            bindingStore.cloneBinding(bindingPath, value);
        }
        if (options && typeof options.onChange === "function") {
            options.onChange(value);
        }
    }, {
        deep: true,
    });
    watch(bindingStore.state, () => {
        if (bindingPath) {
            const newValue = bindingStore.getBinding(bindingPath);
            if (newValue !== bindingModel.value) {
                bindingModel.value = newValue;
            }
        }
    });
    onBeforeMount(() => {
        if (bindingPath) {
            if (options && typeof options.getInitialValue === "function") {
                bindingModel.value = options.getInitialValue();
            } else {
                bindingModel.value = bindingStore.getBinding(bindingPath);
            }
        }
    });
    return {
        bindingModel
    };
}

export function useRendererMessage() {
    const rendererMessageContent = ref("");
    const message = useMessage();
    let rendererMessage: MessageReactive | null = null;

    return {
        showMessage: (text: string) => {
            rendererMessageContent.value = text;
            if (!rendererMessage) {
                rendererMessage = message.create(rendererMessageContent.value, {
                    type: 'warning',
                    duration: 3000,
                    onAfterLeave() {
                        rendererMessage?.destroy();
                        rendererMessage = null;
                    }
                });
            }
        },
    }
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

export function getComponentNameByType(type: string): string {
    const map = new Map([
        ["root", "根容器"],
        ["textInput", "文本输入"],
        ["textNumberInput", "数字输入"],
        ["datePicker", "日期选择器"],
        ["select", "选择器"],
        ["grid", "栅格"],
        ["gridCell", "栅格-列"],
        ["form", "表单"],
        ["formItem", "表单项"],
        ["container", "容器"],
        ["checkboxGroup", "复选框组"],
        ["radioGroup", "单选框组"],
        ["checkbox", "复选框项"],
        ["radio", "单选框项"],
        ["button", "按钮"],
        ["text", "文本"],
        ["image", "图片"]
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
        case "gridCell": {
            return {
                type: "gridCell",
                id: generateComponentId("gridCell"),
                children: [],
                props: {},
            };
        }
        case "grid": {
            const rendererLayout: RendererLayout & Required<Pick<RendererLayout, 'children'>> = {
                type: "grid",
                id: generateComponentId("grid"),
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
                rendererLayout.children.push(createRendererItemConfig({
                    type: "gridCell"
                }));
            }

            return rendererLayout;
        }
        case "textInput": {
            return {
                type: "textInput",
                id: generateComponentId("textInput"),
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
                id: generateComponentId("textNumberInput"),
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
                id: generateComponentId("datePicker"),
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
                id: generateComponentId("select"),
                props: {
                    path: "value",
                    placeholder: "",
                    datasource: "",
                    functionCode: "",
                    options: [],
                },
                outline: {
                    setting: true,
                },
                tooltip: {
                    setting: true,
                },
            };
        case "form": {
            return {
                type: "form",
                props: {
                    showLabel: true,
                    labelPlacement: 'left',
                    labelAlign: 'left',
                },
                id: generateComponentId("form"),
                children: [],
                outline: {
                    setting: true,
                },
            };
        }
        case "formItem": {
            return {
                type: "formItem",
                props: {
                    label: "表单项",
                    component: "",
                },
                id: generateComponentId("formItem"),
                outline: {
                    setting: true,
                },
                children: [],
            };
        }
        case "container": {
            return {
                type: "container",
                props: {
                    label: "容器",
                    component: "",
                    style: {
                        ...componentDefinition.props?.style,
                        paddingLeft: '4px',
                        paddingRight: '4px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        marginLeft: '4px',
                        marginRight: '4px',
                        marginTop: '4px',
                        marginBottom: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                    }
                },
                id: generateComponentId("container"),
                outline: {
                    setting: true,
                },
                children: [],
            };
        }
        case "checkboxGroup": {
            return {
                type: "checkboxGroup",
                id: generateComponentId("checkboxGroup"),
                props: {},
                children: [],
                outline: {
                    setting: true,
                },
            };
        }
        case "checkbox": {
            return {
                type: "checkbox",
                id: generateComponentId("checkbox"),
                props: {
                    label: "标签",
                    value: "值",
                },
                outline: {
                    setting: true,
                },
            };
        }
        case "radioGroup": {
            return {
                type: "radioGroup",
                id: generateComponentId("radioGroup"),
                props: {},
                children: [],
                outline: {
                    setting: true,
                },
            };
        }
        case "radio": {
            return {
                type: "radio",
                id: generateComponentId("radio"),
                props: {
                    label: "标签",
                    value: "值",
                },
                outline: {
                    setting: true,
                },
            };
        }
        case "button": {
            return {
                type: "button",
                id: generateComponentId("button"),
                props: {
                    type: 'primary',
                },
                outline: {
                    setting: true,
                },
                children: [
                    createRendererItemConfig({
                        type: "text",
                    })
                ]
            };
        }
        case "text": {
            return {
                type: "text",
                id: generateComponentId("text"),
                props: {
                    tag: 'span',
                    text: '文本',
                    style: {
                        fontSize: '14px',
                        fontFamily: 'system-ui',
                    }
                },
                outline: {
                    setting: true,
                },
            };
        }
        case "image": {
            return {
                type: "image",
                id: generateComponentId("image"),
                props: {
                    width: '100px',
                    height: '100px',
                    src: '/vite.svg'
                },
                outline: {
                    setting: true,
                },
            };
        }
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
        case 'form':
            return FormNew24Regular;
        case 'formItem':
            return AppsList24Regular;
        case 'container':
            return DocumentMargins24Regular;
        case 'checkboxGroup':
            return CheckboxChecked24Regular;
        case 'radioGroup':
            return RadioButton24Filled;
        case 'checkbox':
            return CheckboxUnchecked24Filled;
        case 'radio':
            return RadioButton24Regular;
        case 'button':
            return ControlButton20Regular;
        case 'text':
            return TextCaseTitle24Filled;
        case 'image':
            return Image24Regular;
        default:
            return Components;
    }
}

export const FeatureTypes = [
    {
        value: 'other',
        label: '其他',
    },
    {
        value: 'select',
        label: '下拉框',
    },
    {
        value: 'radio',
        label: '单选',
    },
    {
        value: 'table',
        label: '表格'
    }
];
