import {defineStore} from "pinia";
import * as dotProp from 'dot-prop';
import {watch} from "vue";

export function useBindingConnector(options: {
    path: string;
    onError?: (err: Error) => void;
    onBindingChange?: (newValue: any, oldValue: any) => void;
}) {
    const bindingStore = useBindingStore();

    watch(() => {
        try {
            return dotProp.getProperty(bindingStore.root, options.path)
        } catch (e) {
            console.error(e);
            if (typeof options.onError === 'function') {
                options.onError(e as Error);
            } else {
                throw e;
            }
        }
    }, function (newValue, oldValue) {
        if (typeof options.onBindingChange === 'function') {
            options.onBindingChange(newValue, oldValue);
        }
    }, {
        deep: true,
    });

    return {
        updateBinding: function (value: any) {
            if (options.path) {
                try {
                    dotProp.setProperty(bindingStore.root, options.path, value);
                } catch (e) {
                    console.error(e);
                    if (typeof options.onError === 'function') {
                        options.onError(e as Error);
                    } else {
                        throw e;
                    }
                }
            }
        },
        queryBinding: function () {
            return dotProp.getProperty(bindingStore.root, options.path);
        }
    }
}

export const useBindingStore = defineStore('binding', {
    state() {
        return {
            root: {
                pageOne: {}
            },
        };
    },
});