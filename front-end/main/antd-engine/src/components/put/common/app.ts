import {useProjectStore} from 'engine-commons/store/project.ts';
import {computed, onBeforeMount, watch} from 'vue';
import {useRoute, useRouter} from "vue-router";
import type {ProjectDefinition} from "engine-commons/types.ts";

export function useAppInit() {
    const MicroAppContext = computed(() => {
        return {
            isMicroAppEnv: window.__MICRO_APP_ENVIRONMENT__
        }
    });

    const route = useRoute();
    const router = useRouter();
    const projectStore = useProjectStore();

    const currentPage = computed(() => {
            return route.params.pageId ? String(route.params.pageId) : '';
        }
    );
    const currentPageIndex = computed(() => {
        const pages = projectStore.project.pages;
        return pages.findIndex((p) => p.id === currentPage.value);
    });

    const hasNext = computed(() => {
        const pages = projectStore.project.pages;
        return pages && currentPageIndex.value < pages.length - 1;
    });

    const hasPrev = computed(() => {
        const pages = projectStore.project.pages;
        return pages && currentPageIndex.value > 0;
    })

    async function toNextPage() {
        if (hasNext.value) {
            const pages = projectStore.project.pages;
            const nextPage = pages[currentPageIndex.value + 1];
            await router.replace(`/${nextPage?.id}`);
        }
    }

    async function toPrevPage() {
        if (hasPrev.value) {
            const pages = projectStore.project.pages;
            const prevPage = pages[currentPageIndex.value - 1];
            await router.replace(`/${prevPage?.id}`);
        }
    }


    onBeforeMount(async () => {
        const packageProjectUrl = import.meta.env.BASE_URL + 'project.json';
        let project: ProjectDefinition | null = null;

        try {
            const response = await fetch(packageProjectUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    responseType: "arraybuffer",
                }
            });
            if (response.status === 200) {
                project = await response.json();
                if (project) {
                    await projectStore.loadProject(project);
                }
            }
        } catch (error) {
            console.info('未发现内置项目信息');
        }

        const pages = projectStore.project.pages;

        if (currentPage.value) {
            await projectStore.switchPage(currentPage.value);
        } else {
            if (Array.isArray(pages) && pages.length > 0 && pages[0]) {
                await router.replace(`/${pages[0].id}`);
            }
        }
    });

    watch(route, async (route) => {
        const {params} = route;
        if (params.pageId) {
            await projectStore.switchPage(params.pageId as string);
        }
    }, {
        immediate: true,
    });

    return {
        currentPage,
        MicroAppContext,
        hasNext,
        toNextPage,
        hasPrev,
        toPrevPage
    }
}

export function useMicroAppInit() {
    let projectStore: ReturnType<typeof useProjectStore> | null = null;

    async function receive(data: {
        type: string;
        payload: any;
    }) {
        switch (data.type) {
            case 'loadProject': {
                if (projectStore) {
                    await projectStore.loadProject(data.payload as ProjectDefinition);
                }
            }
        }
    }

    return {
        onMount() {
            projectStore = useProjectStore();
            window.microApp.addDataListener(receive);
        },
        onUnmount: async () => {
            window.microApp.removeDataListener(receive);

            if (projectStore) {
                await projectStore.reset();
            }
            projectStore = null;
        }
    }
}