<script setup lang="ts">
import type {RendererItemDefinition} from "../../../types.ts";

defineOptions({
	name: 'FormItem'
});

const schema = defineModel<RendererItemDefinition>('schema', {
  type: Object,
  default: () => ({ type: '', id: '', children: undefined })
});
</script>

<template>
	<slot>
    <div>
      <span>{{schema.props?.label}}</span>
    </div>
  </slot>
</template>
