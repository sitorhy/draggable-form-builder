<script setup lang="ts">
import {useRendererStore} from "../store";
import JsonTreeViewer from "./JsonTreeViewer.vue";
import {JsonViewer} from "vue3-json-viewer"

const rendererStore = useRendererStore();
</script>

<template>
  <n-tabs
      class="settings-panel"
      default-value="tree"
      animated
  >
    <n-tab-pane display-directive="show" style="height: 100%;" name="tree" tab="视图">
      <JsonTreeViewer/>
    </n-tab-pane>
    <n-tab-pane display-directive="show" style="height: 100%;" name="json" tab="JSON">
      <JsonViewer :copyable="{copyText: '复制', copiedText:'已复制'}" :value="rendererStore.data" theme="light"
                  :expand-depth="5"/>
    </n-tab-pane>
  </n-tabs>
</template>

<style>
.n-tabs.settings-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-panel .n-tabs-pane-wrapper {
  flex-grow: 0;
  overflow: auto;
}
</style>