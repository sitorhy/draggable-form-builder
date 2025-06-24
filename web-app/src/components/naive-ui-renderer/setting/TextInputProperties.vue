<script setup lang="ts">
import {defineModel} from "vue";

const modelValue = defineModel('modelValue', {
  type: Object as Record<string, any>,
  default: () => ({}),
});
</script>

<template>
  <n-form
      ref="formRef"
      :label-width="80"
      :model="modelValue"
  >
    <n-form-item label="姓名" path="user.name">
      <n-input placeholder="输入姓名"/>
    </n-form-item>
    <n-form-item label="年龄" path="user.age">
      <n-input placeholder="输入年龄"/>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">

</style>