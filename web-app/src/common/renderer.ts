export function getComponentNameByType(type: string): string {
    const map = new Map([
        ["root", "根容器"],
        ["textInput", "文本输入"],
        ["textNumberInput", "数字输入"],
        ["datePicker", "日期选择器"],
        ["select", "选择器"],
        ["grid", "栅格"],
        ["gridColumn", "栅格-列"]
    ]);

    return map.get(type) || 'Unknown';
}