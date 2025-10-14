import { onBeforeMount } from 'vue';
import { useEmphasizeStore } from '../../../store/emphasize.ts';
import useProjectStore from '../../../store/project.ts';

export const EmphasizeContext: {
	emphasizeStore: ReturnType<typeof useEmphasizeStore> | null;
} = {
	emphasizeStore: null
};

export function useAppInit() {
	EmphasizeContext.emphasizeStore = useEmphasizeStore();

	const projectStore = useProjectStore();

	onBeforeMount(async () => {
		if (projectStore.projectList.length > 0) {
			await projectStore.loadProject(projectStore.projectList[0]);
		}
	});
}
