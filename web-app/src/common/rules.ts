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
    }
}

export default DragRules;