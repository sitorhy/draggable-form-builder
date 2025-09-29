import { defineStore } from 'pinia';
import type { ProjectDefinition, RendererItemDefinition } from '../types.ts';
import { getTestProject001 } from '../test/project001.ts';

import page001 from '../test/page001.json';
import page002 from '../test/page002.json';
import page003 from '../test/page003.json';
import page004 from '../test/page004.json';
import { useSchemaStore } from './schema.ts';

const LOCAL_TEST_PAGE_DATA: Record<string, any> = {
	'page001.json': page001,
	'page002.json': page002,
	'page003.json': page003,
	'page004.json': page004
};

export const useProjectStore = defineStore('project', {
	state() {
		return {
			project: {
				title: '',
				name: '',
				id: '',
				pages: []
			},
			projectList: [getTestProject001()],
			currentPage: ''
		} as {
			project: ProjectDefinition;
			currentPage: string;
			projectList: ProjectDefinition[];
		};
	},
	getters: {
		currentPageSchema: (state) => {
			if (state.project) {
				return state.project.pages.find((p) => p.id === state.currentPage);
			}
			return null;
		},
		schemaStore: () => useSchemaStore()
	},
	actions: {
		reset() {
			this.project = {
				title: '',
				name: '',
				id: '',
				pages: []
			};
			this.currentPage = '';
		},
		async switchPage(pageId: string) {
			this.currentPage = pageId;
			const page = this.project.pages.find((p) => p.id === pageId);
			if (page) {
				if (page.localFlag) {
					const data = LOCAL_TEST_PAGE_DATA[page.id];
					if (data) {
						this.schemaStore.loadSchema(
							structuredClone(data as RendererItemDefinition)
						);
					}
				} else {
					if (page.schema) {
						this.schemaStore.loadSchema(page.schema);
					}
				}
			}
		},
		async loadProject(project: ProjectDefinition) {
			this.project = project;
			this.currentPage = project.pages[0]?.id || '';
		}
	}
});
