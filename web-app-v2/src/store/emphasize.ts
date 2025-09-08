import { defineStore } from 'pinia';

export const useEmphasizeStore = defineStore<
	'emphasize',
	{
		schemaId: string;
	},
	{},
	{
		watchSchema: (schemaId: string) => void;
		unwatchSchema: () => void;
	}
>('emphasize', {
	state() {
		return {
			schemaId: ''
		};
	},
	actions: {
		watchSchema(schemaId: string) {
			this.schemaId = schemaId;
		},
		unwatchSchema() {
			this.schemaId = '';
		}
	}
});
