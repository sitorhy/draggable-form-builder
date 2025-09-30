import { useSchemaStore } from '../../../store/schema.ts';
import { useBindingStore } from '../../../store/binding.ts';
import { watch } from 'vue';

export function useAppInit() {
	const schemaStore = useSchemaStore();
	const bindingStore = useBindingStore();

	watch(
		() => schemaStore.schema,
		(value) => {
			if (value) {
				const collection = schemaStore.collectStaticContext();
				bindingStore.resetStaticContext(collection);
			} else {
				bindingStore.resetStaticContext({});
			}
		},
		{
			immediate: true,
			deep: true
		}
	);
}
