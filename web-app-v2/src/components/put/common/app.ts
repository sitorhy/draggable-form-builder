import { useEmphasizeStore } from '../../../store/emphasize.ts';
import { useSchemaStore } from '../../../store/schema.ts';
import { useBindingStore } from '../../../store/binding.ts';
import { watch } from 'vue';

export const EmphasizeContext: {
	emphasizeStore: ReturnType<typeof useEmphasizeStore> | null;
} = {
	emphasizeStore: null
};

export function useAppInit() {
	EmphasizeContext.emphasizeStore = useEmphasizeStore();

	const schemaStore = useSchemaStore();
	const bindingStore = useBindingStore();

	watch(
		schemaStore.schema,
		(value) => {
			if (value) {
				const collection = schemaStore.collectStaticContext();
				bindingStore.resetStaticContext(collection);
			} else {
				bindingStore.resetStaticContext({});
			}
		},
		{
			immediate: true
		}
	);
}
