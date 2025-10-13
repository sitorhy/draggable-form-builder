<script setup lang="ts">
import {computed, provide, ref, watch} from "vue";
import {v4 as uuid} from 'uuid';
import JsonRenderer from "./components/put/JsonRenderer.vue";
import BindingContext from "engine-commons/components/put/data/BindingContext.vue";
import {useSchemaStore} from "engine-commons/store/schema.ts";
import {useAppInit} from "./components/put/common/app.ts";
import {useProjectStore} from "engine-commons/store/project.ts";
import {message} from 'ant-design-vue';

const [messageApi] = message.useMessage();

const projectStore = useProjectStore();

const schemaStore = useSchemaStore();
const schema = computed(() => schemaStore.$state.schema);
const schemaKey = ref(uuid());

watch(
    schema,
    function () {
      schemaKey.value = uuid();
    },
    {
      deep: true
    }
);

const {
  hasNext,
  toNextPage,
  hasPrev,
  toPrevPage,
  MicroAppContext
} = useAppInit();

function onPrevPage() {
  toPrevPage();
}

function onNextPage() {
  toNextPage();
}

const messageTool = computed(() => {
  return {
    info: (text: string) => messageApi.info(text),
    success: (text: string) => messageApi.success(text),
    error: (text: string) => messageApi.error(text)
  };
});

provide('messageTool', messageTool);
</script>

<template>
  <a-app>
    <a-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
      <a-layout>
        <a-layout-header bordered v-if="!MicroAppContext.isMicroAppEnv">
          <a-menu
              theme="dark"
              mode="horizontal"
              :style="{ lineHeight: '64px' }"
          >
            <a-menu-item type="primary" @click="onPrevPage" :disabled="!hasPrev">
              <span>上一页</span>
            </a-menu-item>

            <a-menu-item type="primary" @click="onNextPage" :disabled="!hasNext">
              <span>下一页</span>
            </a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout-content :contentStyle="{padding: '8px 0'}">
          <div
              class="preview"
              style="
								width: 100%;
								height: 100%;
								margin: auto;
								position: relative;
							"
          >
            <BindingContext custom-path="">
              <JsonRenderer :key="schemaKey" v-model:schema="schema"/>
            </BindingContext>
          </div>
        </a-layout-content>
      </a-layout>
    </a-space>
  </a-app>
</template>

<style>
#print > div {
  page-break-after: always;
}
</style>
