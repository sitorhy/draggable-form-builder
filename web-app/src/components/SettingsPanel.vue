<script setup lang="ts">
import JsonTreeViewer from "./JsonTreeViewer.vue";
</script>

<template>
  <n-tabs
      class="settings-panel"
      default-value="tree"
      animated
  >
    <n-tab-pane display-directive="show" style="height: 100%;" name="tree" tab="大纲">
      <JsonTreeViewer/>
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