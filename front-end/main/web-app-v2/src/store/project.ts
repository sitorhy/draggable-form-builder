import { defineStore } from 'pinia';
import type { ProjectDefinition, RendererItemDefinition } from '../types.ts';

// test
import { getTestProject001 } from '../test/project001.ts';
import { getTestProject002 } from '../test/project002.ts';
import page000 from '../test/page000.json';
import page001 from '../test/page001.json';
import page002 from '../test/page002.json';
import page003 from '../test/page003.json';
import page004 from '../test/page004.json';
import page005 from '../test/page005.json';
// test
import { collectStaticContext, useSchemaStore } from './schema.ts';
import { useFunctionStore } from './function.ts';
import { useBindingStore } from './binding.ts';
import { createRendererItemConfig } from './component.ts';
import { v4 as uuid } from 'uuid';
import { SequenceGenerator } from '../components/put/common/seq.ts';
import { useRemoteDatasourceResolver } from '../components/put/common/props.ts';
import { parseUri } from '../components/visual/data-source/config.ts';

// test
const LOCAL_TEST_PAGE_DATA: Record<string, any> = {
	'page000.json': page000,
	'page001.json': page001,
	'page002.json': page002,
	'page003.json': page003,
	'page004.json': page004,
	'page005.json': page005
};
// test

const seqGenerator = new SequenceGenerator({
	startFrom: Math.floor(Math.random() * 1000)
});

const useProjectStore = defineStore('project', {
	state() {
		return {
			project: {
				engine: '',
				title: '',
				name: '',
				id: '',
				pages: []
			},
			// projectList: [getTestProject002(), getTestProject001()],
			projectList: [getTestProject001(), getTestProject002()],
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
		async packageProject(options?: { pageIds?: string[] }) {
			const pages = await Promise.all(
				this.project.pages
					.filter((p) => {
						if (options && options.pageIds) {
							return options.pageIds.includes(p.id);
						} else {
							return true;
						}
					})
					.map(async (page) => {
						const schema = await this.loadPageSchema(page);
						return {
							id: page.id,
							title: page.title,
							schema: schema
						};
					})
			);
			const project: ProjectDefinition = {
				engine: this.project.engine,
				title: this.project.title,
				name: this.project.name,
				id: this.project.id,
				pages: pages,
				functions: this.functionStore.functions,
				initStateModuleName: this.project.initStateModuleName,
				preloadDataSources: this.project.preloadDataSources
			};
			return JSON.parse(JSON.stringify(project));
		},
		async loadPageSchema(page: {
			id: string;
			title: string;
			schema?: RendererItemDefinition;
			localFlag?: boolean; // 本地测试用途
		}) {
			if (page.localFlag) {
				// localFlag 本地测试特殊标记，刷新浏览器后重置所有操作
				const data = LOCAL_TEST_PAGE_DATA[page.id];
				if (data) {
					return structuredClone(data as RendererItemDefinition);
				}
			} else {
				if (page.schema) {
					return JSON.parse(JSON.stringify(page.schema));
				}
			}
			return {};
		},
		createNewPage(options: { localFlag?: boolean }) {
			const page = createRendererItemConfig({
				type: 'page'
			});
			const id = uuid();

			if (options?.localFlag) {
				LOCAL_TEST_PAGE_DATA[id] = page;
			}

			this.project.pages.push({
				id: id,
				title: '测试数据_' + seqGenerator.next(),
				schema: structuredClone(page),
				localFlag: options?.localFlag
			});

			return id;
		},
		async switchPage(pageId: string) {
			const currentPageSchema = this.project.pages.find(
				(p) => p.id === this.currentPage
			);
			if (currentPageSchema && currentPageSchema.localFlag) {
				// 本地测试标记，缓存改动
				LOCAL_TEST_PAGE_DATA[currentPageSchema.id] = JSON.parse(
					JSON.stringify(this.schemaStore.schema)
				);
			}
			this.currentPage = pageId;
			const page = this.project.pages.find((p) => p.id === pageId);
			if (page) {
				const schema = await this.loadPageSchema(page);
				this.schemaStore.loadSchema(schema);
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
			await Promise.all(
				pages.map(async (page) => {
					page.schema = await this.loadPageSchema(page);
				})
			);
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
export default useProjectStore;
