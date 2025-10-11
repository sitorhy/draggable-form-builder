<script setup lang="ts">
import {computed, ref, watch} from "vue";
import { v4 as uuid } from 'uuid';
import JsonRenderer from "./components/put/JsonRenderer.vue";
import BindingContext from "engine-commons/components/put/data/BindingContext.vue";
import {useSchemaStore} from "engine-commons/store/schema.ts";
import {useAppInit} from "./components/put/common/app.ts";
import {useProjectStore} from "engine-commons/store/project.ts";
import {VuePrintNext} from "vue-print-next";

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

function onPrint() {
  new VuePrintNext({
    el: '#print',
    extraCss: 'print.css',
    closeCallback() {
    }
  });
}
</script>

<template>
  <n-space vertical>
    <n-layout>
      <n-layout-header bordered v-if="!MicroAppContext.isMicroAppEnv">
        <n-button-group>
          <n-button type="primary" @click="onPrevPage" :disabled="!hasPrev">
            <span>上一页</span>
          </n-button>

          <n-button type="primary" @click="onNextPage" :disabled="!hasNext">
            <span>下一页</span>
          </n-button>

          <n-button type="primary" @click="onPrint">
            <span>打印</span>
          </n-button>
        </n-button-group>
      </n-layout-header>
      <n-layout :contentStyle="{padding: '8px 0'}">
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

        <div v-show="false">
          <div id="print">
            <div v-for="p in projectStore.$state.project.pages" :key="p.id">
              <BindingContext v-model:schema="p.schema" custom-path="">
                <JsonRenderer v-model:schema="p.schema"/>
              </BindingContext>
            </div>
          </div>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style>
#print > div {
  page-break-after: always;
}
</style>
