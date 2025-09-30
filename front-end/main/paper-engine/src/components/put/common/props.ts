import { computed } from 'vue';

export function useEmptyPropsInjection() {
	const emptyPropsInjection = computed(() => {
		return {};
	});

	return {
		emptyPropsInjection
	};
}
