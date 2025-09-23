import { defineStore } from 'pinia';
import type { ProjectDefinition } from '../types.ts';
import { getTestProjects } from '../test/projects.ts';

export const useProjectStore = defineStore<
	'project',
	{
		projects: ProjectDefinition[];
		currentProject: string;
		currentPage: string;
	},
	{},
	{
		getProjectPages: (projectId: string) => ProjectDefinition | undefined;
		watchProject: (projectId: string, pageId: string) => void;
	}
>('project', {
	state() {
		return {
			projects: getTestProjects(),
			currentProject: '',
			currentPage: ''
		};
	},
	actions: {
		getProjectPages(projectId: string) {
			return this.projects.find((project) => project.id === projectId);
		},
		watchProject(projectId: string, pageId: string) {
			this.currentProject = projectId;
			this.currentPage = pageId;
		}
	}
});
