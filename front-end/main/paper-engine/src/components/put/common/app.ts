import {collectStaticContext, useSchemaStore} from '../../../store/schema.ts';
import {useBindingStore} from '../../../store/binding.ts';
import {useProjectStore} from '../../../store/project.ts';
import {computed, onBeforeMount, watch} from 'vue';

export function useAppInit() {
    const schemaStore = useSchemaStore();
    const bindingStore = useBindingStore();
    const projectStore = useProjectStore();

    const currentPage = computed(() => projectStore.currentPage);
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
            await projectStore.switchPage(nextPage?.id as string);
        }
    }

    async function toPrevPage() {
        if (hasPrev.value) {
            const pages = projectStore.project.pages;
            const prevPage = pages[currentPageIndex.value - 1];
            await projectStore.switchPage(prevPage?.id as string);
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
        if (Array.isArray(pages) && pages.length > 0 && pages[0]) {
            await projectStore.switchPage(pages[0].id);
        }
    });

    return {
        hasNext,
        toNextPage,
        hasPrev,
        toPrevPage
    }
}
