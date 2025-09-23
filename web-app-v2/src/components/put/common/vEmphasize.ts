import { useEmphasizeStore } from '../../../store/emphasize.ts';

export const VEmphasize = {
	mounted(
		el: HTMLElement,
		binding: {
			arg: string;
			value: any;
		}
	) {
		const emphasizeStore = useEmphasizeStore();

		el.__clickHighlightHandler = (event: MouseEvent) => {
			if (el.contains(event.target)) {
				event.stopImmediatePropagation();

				const schemaId = el.dataset.schemaId;
				emphasizeStore.watchSchema(schemaId);
			}
		};
		el.dataset.schemaId = binding.value;
		window.addEventListener('click', el.__clickHighlightHandler);
	},
	unmounted(el: HTMLElement) {
		window.removeEventListener('click', el.__clickHighlightHandler);
		delete el.dataset.schemaId;
	}
};
