import { defineStore } from 'pinia';
import type { ProjectDefinition } from '../types.ts';

import page001 from '../assets/page001.json';
import page002 from '../assets/page002.json';
import page003 from '../assets/page003.json';
import page004 from '../assets/page004.json';
import { useSchemaStore } from './schema.ts';

export const useProjectStore = defineStore('project', {
	state() {
		return {
			project: {
                id: '3865f2fe-57bb-4ba8-9f10-407f2deeff5c',
                name: 'testProject_001',
                title: '普通高中高三第一学期期中考试',
                pages: [
                    {
                        id: 'page001.json',
                        title: '第一页',
                        schema: page001
                    },
                    {
                        id: 'page002.json',
                        title: '第二页',
                        schema: page002
                    },
                    {
                        id: 'page003.json',
                        title: '第三页',
                        schema: page003
                    },
                    {
                        id: 'page004.json',
                        title: '第四页',
                        schema: page004
                    }
                ]
            } as ProjectDefinition,
			currentPage: ''
		}
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
                if (page.schema) {
                    this.schemaStore.loadSchema(page.schema);
                }
            }
        },
		async loadProject(project: ProjectDefinition) {
			this.project = project;
			this.currentPage = project.pages[0]?.id || '';
		}
	}
});
