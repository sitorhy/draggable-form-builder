import { onBeforeMount, watch } from 'vue';
import { useEmphasizeStore } from '../../../store/emphasize.ts';
import {collectStaticContext, useSchemaStore} from '../../../store/schema.ts';
import { useBindingStore } from '../../../store/binding.ts';
import { useProjectStore } from '../../../store/project.ts';

// import {unitTest} from '../../../test/data.ts';

export const EmphasizeContext: {
	emphasizeStore: ReturnType<typeof useEmphasizeStore> | null;
} = {
	emphasizeStore: null
};

export function useAppInit() {
	EmphasizeContext.emphasizeStore = useEmphasizeStore();

	const projectStore = useProjectStore();
	const schemaStore = useSchemaStore();
	const bindingStore = useBindingStore();

	watch(
		() => schemaStore.schema,
		(value) => {
			if (value) {
				const collection = schemaStore.collectStaticContext();
				bindingStore.assignStaticContext(collection);
			} else {
				bindingStore.assignStaticContext({});
			}
		},
		{
			immediate: true,
			deep: true
		}
	);

	onBeforeMount(async () => {
		if (projectStore.projectList.length > 0) {
			await projectStore.loadProject(projectStore.projectList[0]);
            bindingStore.resetStaticContext({});

			const pages = projectStore.project.pages;
            pages.forEach(page => {
                if (page.schema) {
                    const collection = {};
                    collectStaticContext(page.schema, collection);
                    bindingStore.assignStaticContext(collection);
                }
            });

			if (pages.length > 0) {
				await projectStore.switchPage(pages[0].id);
				// await projectStore.switchPage('page002.json');
                // await schemaStore.loadSchema(unitTest());
			}
		}
	});
}
