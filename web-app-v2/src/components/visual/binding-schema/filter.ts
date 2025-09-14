import type { ComputedRef } from 'vue';
import type { RendererItemDefinition } from '../../../types.ts';
import { useSchemaActions } from '../../../store/schema.ts';

export function useFormItemSchemaFilter() {
	const { findAncestorsByNodeId } = useSchemaActions();

	function filterFormItemSchema(
		watchingSchema: ComputedRef<RendererItemDefinition | null>
	) {
		const itemProps = [];
		if (watchingSchema.value) {
			const parents = findAncestorsByNodeId(watchingSchema.value.id);
			const formItemWrapped = parents.some(
				(i) => i.type === 'formItem' && i.id !== watchingSchema.value?.id
			);
			if (formItemWrapped) {
				itemProps.push({
					prop: 'path',
					props: {
						disabled: false
					},
					visible: () => false
				});
			}
		}

		return itemProps;
	}

	return {
		filterFormItemSchema
	};
}
