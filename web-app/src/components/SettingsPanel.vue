<script setup lang="ts">
import JsonTreeViewer from "./JsonTreeViewer.vue";
import PropertiesViewer from "./PropertiesViewer.vue";
</script>

<template>
  <n-tabs
      class="settings-panel"
      default-value="tree"
      :animated="false"
  >
    <n-tab-pane display-directive="show" style="height: 100%;" name="tree" tab="大纲">
      <JsonTreeViewer/>
    </n-tab-pane>
    <n-tab-pane display-directive="show" style="height: 100%;" name="properties" tab="设置">
      <PropertiesViewer/>
    </n-tab-pane>
  </n-tabs>
</template>

<style>
.settings-panel {
  padding: 0 17px 0 17px;
}

.settings-panel .n-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.settings-panel .n-tabs-pane-wrapper {
  flex-grow: 0;
  overflow: auto;
}
</style>