<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <RouterView />
    </n-config-provider>
  </n-message-provider>
</template>

<style>
body {
  padding: 12px;
}
</style>