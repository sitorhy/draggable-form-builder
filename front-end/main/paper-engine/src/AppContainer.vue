<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <RouterView />
  </n-config-provider>
</template>

<style>
body {
  padding: 12px;
}
</style>