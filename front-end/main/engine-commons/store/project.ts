import { defineStore } from 'pinia';
import type { ProjectDefinition } from '../types.ts';
import { collectStaticContext, useSchemaStore } from './schema.ts';
import { useFunctionStore } from './function.ts';
import { useBindingStore } from './binding.ts';
import { useRemoteDatasourceResolver } from '../components/put/common/props.ts';
import { parseUri } from '../components/visual/data-source/config.ts';

export const useProjectStore = defineStore('project', {
	state() {
		return {
			project: {
				engine: '',
				title: '',
				name: '',
				id: '',
				pages: []
			},
			projectList: [],
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
		schemaStore: () => useSchemaStore(),
		functionStore: () => useFunctionStore(),
		bindingStore: () => useBindingStore(),
		remoteDataSourceResolver: () => useRemoteDatasourceResolver()
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

			if (project.functions) {
				await Promise.all(
					project.functions.map((code) => {
						return this.functionStore.createFunctionCode(code);
					})
				);
			}
			await Promise.all(
				this.functionStore.functions.map((code) =>
					this.functionStore.loadModule(code)
				)
			);

			if (project.initStateModuleName) {
				const initFunc = this.functionStore.tryGetDefaultFunctionByModuleName(
					project.initStateModuleName
				);
				if (typeof initFunc === 'function') {
					this.bindingStore.$state.state = initFunc() || {};
				}
			}

			if (
				project.preloadDataSources &&
				Object.keys(project.preloadDataSources).length > 0
			) {
				const dataSet = await Promise.all(
					Object.keys(project.preloadDataSources).map(async (path: string) => {
						const uri = (project.preloadDataSources as Record<string, string>)[
							path
						];
						if (uri) {
							const dataSourceSchema = parseUri(uri);
							try {
								return [
									path,
									await this.remoteDataSourceResolver.resolveRemoteDatasource(
										dataSourceSchema
									)
								];
							} catch (e) {
								console.error(e);
							}
						}
						return [path, undefined];
					})
				);
				const filterDataSet = dataSet.filter((v) => v[1] !== undefined);
				filterDataSet.forEach(([bindingPath, remoteCollectionData]) => {
					this.bindingStore.updateBinding(bindingPath, remoteCollectionData);
				});
			}

			const pages = project.pages;

			pages.forEach((page) => {
				if (page.schema) {
					const collection = {};
					collectStaticContext(page.schema, collection, this.bindingStore);
					this.bindingStore.assignStaticContext(collection);
				}
			});

			this.currentPage = '';
			this.project = project;

			if (pages.length > 0) {
				const page = pages[0];
				if (page) {
					await this.switchPage(page.id);
				}
			}
		}
	}
});
