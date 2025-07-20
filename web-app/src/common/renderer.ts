import {defineComponent, h, ref} from 'vue';
import {useMessage} from "naive-ui";
import type {MessageReactive} from 'naive-ui';
import {useRendererStore} from "../store.ts";
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
import TextInput from "../components/naive-ui-renderer/TextInput.vue";
import TextNumberInput from "../components/naive-ui-renderer/TextNumberInput.vue";
import DatePicker from "../components/naive-ui-renderer/DatePicker.vue";
import Select from "../components/naive-ui-renderer/Select.vue";

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

export function getComponentByType(type: string) {
    const map = new Map([
        ["textInput", TextInput],
        ["textNumberInput", TextNumberInput],
        ["datePicker", DatePicker],
        ["select", Select],
    ]);

    return map.get(type) || defineComponent({
        render: () => h('div', {}, 'Unknow Component'),
    });
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
        case "form": {
            return {
                type: "form",
                props: {
                    showLabel: true,
                    labelPlacement: 'left',
                    labelAlign: 'left',
                },
                id: uuid(),
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
                id: uuid(),
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                    }
                },
                id: uuid(),
                outline: {
                    setting: true,
                },
                children: [],
            };
        }
        case "checkboxGroup": {
            return {
                type: "checkboxGroup",
                id: uuid(),
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
                id: uuid(),
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
                id: uuid(),
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
                id: uuid(),
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
                id: uuid(),
                props: {
                    type: 'primary',
                },
                outline: {
                    setting: true,
                },
                children: [
                    {
                        type: "text",
                        id: uuid(),
                        props: {
                            tag: 'span',
                            text: '按钮'
                        },
                        outline: {
                            setting: true,
                        },
                    },
                ]
            };
        }
        case "text": {
            return {
                type: "text",
                id: uuid(),
                props: {
                    tag: 'span',
                    text: '文本'
                },
                outline: {
                    setting: true,
                },
            };
        }
        case "image": {
            return {
                type: "image",
                id: uuid(),
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
