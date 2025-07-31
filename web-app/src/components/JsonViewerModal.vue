<script setup lang="ts">
import {ref, computed} from 'vue'
import {JsonViewer} from "vue3-json-viewer";
import {useRendererStore, useBindingStore} from "../store.ts";
import hljs from 'highlight.js/lib/core'

const rendererStore = useRendererStore();
const bindingStore = useBindingStore();

const showJsonViewer = defineModel('modelValue', {
  type: Boolean,
  default: false
});
const codeMode = ref<boolean>(false);

const jsonText = computed(() => JSON.stringify(rendererStore.data, null, 2));
const bindingJson = computed(() => JSON.stringify(bindingStore.state, null, 2));
</script>

<template>
  <n-modal v-model:show="showJsonViewer">
    <n-card
        style="width: 80%"
        title="JSON Viewer"
        :bordered="false"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-space>
          <label>代码模式</label>
          <n-switch v-model:value="codeMode"/>
        </n-space>
      </template>

      <n-tabs
          default-value="json"
      >
        <n-tab-pane name="json" tab="组件">
          <JsonViewer v-if="!codeMode" :copyable="{copyText: '复制', copiedText:'已复制'}" :value="rendererStore.data"
                      :expand-depth="5"/>
          <n-code v-else :hljs="hljs" :code="jsonText" :show-line-numbers="true" language="json"/>
        </n-tab-pane>

        <n-tab-pane name="binding" tab="值域">
          <JsonViewer v-if="!codeMode" :copyable="{copyText: '复制', copiedText:'已复制'}" :value="bindingStore.state"
                      :expand-depth="5"/>
          <n-code v-else :hljs="hljs" :code="bindingJson" :show-line-numbers="true" language="json"/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-modal>
</template>

<style lang="scss">
// values are default one from jv-light template
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }

  .jv-button {
    color: #49b3ff
  }

  .jv-key {
    color: #111111
  }

  .jv-item {
    &.jv-array {
      color: #111111
    }

    &.jv-boolean {
      color: #fc1e70
    }

    &.jv-function {
      color: #067bca
    }

    &.jv-number {
      color: #fc1e70
    }

    &.jv-number-float {
      color: #fc1e70
    }

    &.jv-number-integer {
      color: #fc1e70
    }

    &.jv-object {
      color: #111111
    }

    &.jv-undefined {
      color: #e08331
    }

    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }

  .jv-code {
    padding: 0;

    .jv-toggle {
      &:before {
        padding: 0 2px;
        border-radius: 2px;
      }

      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>