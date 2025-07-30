<script setup lang="ts">
import {getCurrentInstance, onBeforeMount, onUnmounted} from "vue";

onBeforeMount(function (): void {
  console.log('Mounted', getCurrentInstance()?.type);
});

onUnmounted(function (): void {
  console.log('Unmounted', getCurrentInstance()?.type);
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss">

</style>