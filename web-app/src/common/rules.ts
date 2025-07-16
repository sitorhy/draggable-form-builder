import type {RuleParams} from "../types";

function hasParentClass(e: HTMLElement | null, className: string): boolean {
    if (!e) {
        return false;
    }
    if (e.classList.contains(className)) {
        return true;
    }
    return hasParentClass(e.parentElement, className);
}

const DragRules: Record<string, (params: RuleParams) => boolean> = {
    checkbox: function(params: RuleParams): boolean {
        if (!hasParentClass(params.to, 'checkbox-group')) {
            throw new Error('复选框项需包含在复选框组中');
        }
        return true;
    },
    radio: function(params: RuleParams): boolean {
        if (!hasParentClass(params.to, 'radio-group')) {
            throw new Error('单选框项需包含在单选框组中');
        }
        return true;
    },
    formItem: function(params: RuleParams): boolean {
        if (!hasParentClass(params.to, 'form') || hasParentClass(params.to, 'form-item')) {
            throw new Error('表单项需包含在表单中');
        }
        return true;
    }
}

export default DragRules;