<script setup lang="ts">
import {type PropType} from "vue";
import type {RendererLayout} from "../../../types";

defineProps({
  value: {
    type: Object as PropType<RendererLayout | null | undefined>,
    default: () => ({
      props: {}
    }),
  }
});
</script>

<template>
  <textarea style="width: 100%" :rows="10" :value="JSON.stringify(value?.props, null, 2)" readonly/>
</template>