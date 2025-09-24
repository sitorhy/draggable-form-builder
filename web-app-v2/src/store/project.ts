import { defineStore } from 'pinia';
import type { ProjectDefinition } from '../types.ts';
import { getTestProject001 } from '../test/project.ts';

export const useProjectStore = defineStore<
	'project',
	{
		project: ProjectDefinition;
		currentPage: string;
	},
	{},
	{
		switchPage: (pageId: string) => void;
		loadProject: (project: ProjectDefinition) => void;
	}
>('project', {
	state() {
		return {
			project: getTestProject001(),
			currentPage: ''
		};
	},
	getters: {
		currentPageSchema: (state) => {
			if (state.project) {
				return state.project.pages.find((p) => p.id === state.currentPage);
			}
			return null;
		}
	},
	actions: {
		switchPage(pageId: string) {
			this.currentPage = pageId;
		},
		loadProject(project: ProjectDefinition) {
			this.project = project;
			this.currentPage = project.pages[0]?.id || '';
		}
	}
});
