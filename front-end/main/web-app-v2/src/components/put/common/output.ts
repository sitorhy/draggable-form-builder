import { computed } from 'vue';

export function useOutputEnginesInfo() {
	const options = computed(() => {
		return [
			{
				value: 'pager-engine-app',
				label: '纸质引擎',
				name: 'pager-engine-app',
				url: `${location.protocol}//${location.hostname}:6681/`
			}
		];
	});

	return {
		engineOptions: options
	};
}
