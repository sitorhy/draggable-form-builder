import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

function toRelativeRect(el: Element) {
	const rect = el.getBoundingClientRect();
	let top = 0;
	let left = 0;
	let parent = el;
	while (parent) {
		const pRect = parent.getBoundingClientRect();
		top = pRect.top;
		left = pRect.left;

		if (parent.style.position === 'relative') {
			break;
		}

		parent = parent.parentNode;
	}

	return {
		left: rect.left - left,
		top: rect.top - top,
		width: rect.width,
		height: rect.height
	};
}

export const useEmphasizeStore = defineStore<
	'emphasize',
	{
		schemaId: string;
		bounds: {
			id: string;
			left: number;
			top: number;
			right?: number;
			bottom?: number;
			height: number;
			width: number;
		}[];
	},
	{},
	{
		watchSchemaBounds: (
			schemaId: string,
			bounds: {
				id: string;
				left: number;
				top: number;
				right?: number;
				bottom?: number;
				height: number;
				width: number;
			}[]
		) => void;
		unwatchSchema: () => void;
		watchSchema: (schemaId: string) => void;
	}
>('emphasize', {
	state() {
		return {
			schemaId: '',
			bounds: []
		};
	},
	actions: {
		watchSchema(schemaId: string) {
			if (schemaId) {
				const list = document.querySelectorAll(
					`[data-schema-id="${schemaId}"]`
				);
				if (list && list.length) {
					const bounds = Array.from(list).map((el) => toRelativeRect(el));
					this.watchSchemaBounds(schemaId, bounds);
				} else {
					this.unwatchSchema();
				}
			} else {
				this.unwatchSchema();
			}
		},
		watchSchemaBounds(
			schemaId: string,
			bounds: {
				left: number;
				top: number;
				right?: number;
				bottom?: number;
				height: number;
				width: number;
			}[]
		) {
			this.schemaId = schemaId;
			this.bounds = bounds.map((r) => {
				return {
					left: r.left,
					top: r.top,
					right: r.right,
					bottom: r.bottom,
					width: r.width,
					height: r.height,
					id: uuid()
				};
			});
		},
		unwatchSchema() {
			this.schemaId = '';
			this.bounds = [];
		}
	}
});
