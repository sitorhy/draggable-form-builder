<script setup lang="ts">
import {useRendererStore} from "../store.ts";

const rendererStore = useRendererStore();
</script>

<template>
  <n-tabs
      class="card-tabs"
      default-value="json"
      animated
  >
    <n-tab-pane style="height: 100%;" name="json" tab="JSON">
      <textarea style="width: 100%; height: 80vh;" readonly>{{rendererStore.data}}</textarea>
    </n-tab-pane>
  </n-tabs>
</template>