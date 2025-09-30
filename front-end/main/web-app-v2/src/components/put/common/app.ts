import { useEmphasizeStore } from '../../../store/emphasize.ts';
import { useSchemaStore } from '../../../store/schema.ts';
import { useBindingStore } from '../../../store/binding.ts';
import { onBeforeMount, watch } from 'vue';
import { useProjectStore } from '../../../store/project.ts';

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
				bindingStore.resetStaticContext(collection);
			} else {
				bindingStore.resetStaticContext({});
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
			const pages = projectStore.project.pages;
			if (pages.length > 0) {
				await projectStore.switchPage(pages[0].id);
				// await projectStore.switchPage('page002.json');
			}
		}
	});
}
