import { EmphasizeContext } from './app.ts';

export const VEmphasize = {
	mounted(
		el: HTMLElement & Record<string, any>,
		binding: {
			arg: string;
			value: any;
		}
	) {
		const emphasizeStore = EmphasizeContext.emphasizeStore;

		el.__clickHighlightHandler = (event: MouseEvent) => {
			if (el.contains(event.target as Node)) {
				event.stopImmediatePropagation();

				const schemaId = el.dataset.schemaId;
				emphasizeStore?.watchSchema(schemaId as string);
			}
		};
		el.dataset.schemaId = binding.value;
		window.addEventListener('click', el.__clickHighlightHandler);
	},
	unmounted(el: HTMLElement & Record<string, any>) {
		window.removeEventListener('click', el.__clickHighlightHandler);
		delete el.dataset.schemaId;
	}
};
