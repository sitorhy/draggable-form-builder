export function unitTest() {
    return {
        "type": "page",
        "children": [
            {
                "type": "textInput",
                "id": "textInput_d1769a2e-e571-43e8-ad32-327c16704015",
                "props": {
                    "placeholder": "文本框",
                    "type": "text",
                    "rows": 2
                }
            },
            {
                "type": "array",
                "id": "array_06f601da-67a6-4753-8625-9493b9e9cbc0",
                "props": {
                    "dataSource": "",
                    "loop": [
                        {
                            "id": "0x1234",
                        },
                        {
                            "id": "0x1235",
                        },
                        {
                            "id": "0x1236",
                        }
                    ]
                },
                "children": [
                    {
                        "type": "textInput",
                        "id": "textInput_7b7f60c2-1277-4da8-86fd-ee78a7833d6d",
                        "props": {
                            "placeholder": "文本框",
                            "type": "text",
                            "rows": 2
                        }
                    }
                ]
            }
        ]
    };
}