import { computed } from 'vue';

export function useOutputEnginesInfo() {
	const options = computed(() => {
		return [
			{
				value: 'Paper',
				label: '纸质引擎',
				name: 'Paper',
				url: `${location.protocol}//${location.hostname}:6681/`
			}
		];
	});

	return {
		engineOptions: options
	};
}
