import {defineStore} from 'pinia';
import type {ProjectDefinition} from '../types.ts';
import {collectStaticContext, useSchemaStore} from './schema.ts';
import {useBindingStore} from "./binding.ts";
import {useFunctionStore} from "./function.ts";

export const useProjectStore = defineStore('project', {
    state() {
        return {
            project: {
                title: '',
                name: '',
                id: '',
                pages: []
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
        functionStore: () => useFunctionStore(),
        schemaStore: () => useSchemaStore(),
        bindingStore: () => useBindingStore()
    },
    actions: {
        async reset() {
            await this.loadProject({
                title: '',
                name: '',
                id: '',
                pages: []
            });
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
            this.schemaStore.resetSchema();
            this.bindingStore.resetStaticContext({});
            this.functionStore.reset();
            this.currentPage = '';
            this.project = project;

            if (this.project.functions) {
                for (const func of this.project.functions) {
                    await this.functionStore.createFunctionCode(func);
                }
            }

            const pages = this.project.pages;
            pages.forEach(page => {
                if (page.schema) {
                    const collection = {};
                    collectStaticContext(page.schema, collection);
                    this.bindingStore.assignStaticContext(collection);
                }
            });

            if (pages.length > 0) {
                const page = pages[0];
                if (page) {
                    await this.switchPage(page.id);
                }
            }
        }
    }
});
