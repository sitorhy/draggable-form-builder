import {collectStaticContext, useSchemaStore} from '../../../store/schema.ts';
import {useBindingStore} from '../../../store/binding.ts';
import {useProjectStore} from '../../../store/project.ts';
import {computed, onBeforeMount, watch} from 'vue';
import {useRoute, useRouter} from "vue-router";

export function useAppInit() {
    const route = useRoute();
    const router = useRouter();
    const schemaStore = useSchemaStore();
    const bindingStore = useBindingStore();
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
        const pages = projectStore.project.pages;

        pages.forEach(page => {
            if (page.schema) {
                const collection = {};
                collectStaticContext(page.schema, collection);
                bindingStore.assignStaticContext(collection);
            }
        });

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
        hasNext,
        toNextPage,
        hasPrev,
        toPrevPage
    }
}
