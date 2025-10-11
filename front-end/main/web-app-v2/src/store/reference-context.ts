import { defineStore } from 'pinia';
import {
	type ComponentInstance,
	type ComputedRef,
	onMounted,
	onUnmounted,
	ref,
	watch
} from 'vue';

export const useReferenceContext = defineStore('reference', {
	state: () => ({
		references: new Map<string, ComponentInstance<any>>()
	}),
	actions: {
		registerReference(bindingPath: string, instance: ComponentInstance<any>) {
			this.references.set(bindingPath, instance);
		},
		unregisterReference(bindingPath: string) {
			this.references.delete(bindingPath);
		}
	}
});

export function useReferenceRegister(
	bindingPath: ComputedRef<string> | undefined
) {
	const componentRef = ref();
	if (!bindingPath) {
		return {
			componentRef
		};
	}
	const referenceContext = useReferenceContext();

	onMounted(function () {
		referenceContext.registerReference(bindingPath.value, componentRef.value);
	});

	onUnmounted(function () {
		referenceContext.unregisterReference(bindingPath.value);
	});

	watch(bindingPath, function (value, oldValue) {
		referenceContext.unregisterReference(oldValue);
		referenceContext.registerReference(value, componentRef.value);
	});

	return {
		componentRef
	};
}
