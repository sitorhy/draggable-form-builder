<script setup lang="ts">

</script>

<template>
  <div class="edgeInsets" style="padding: 5px; border: 1px solid red;">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.edgeInsets {
  --n-hegiht: 34px;
  min-height: var(--n-hegiht);
}
</style>