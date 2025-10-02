<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
import App from "./App.vue";
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <App/>
  </n-config-provider>
</template>

<style>
body {
  padding: 12px;
}
</style>