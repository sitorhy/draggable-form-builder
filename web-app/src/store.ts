import {defineStore} from "pinia";

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
                        },
                    ]
                },
            ]
        }
    },
});

export const useRendererStore = defineStore('renderers', {
   state() {
       return {
           data: {
               id: "#",
               type: 'root',
               description: "根容器，有且只有一个子节点",
               children: []
           }
       };
   }
});