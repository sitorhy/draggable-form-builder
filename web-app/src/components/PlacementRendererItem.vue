<script setup lang="ts">
import {ref, watch, defineEmits, defineProps} from 'vue';
import {VueDraggable} from 'vue-draggable-plus';
import {PlusFilled} from '@vicons/material';

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
});

const children = ref([]);
const emit = defineEmits(['replace']);

watch(children, (value) => {
  if (value.length > 0) {
    emit('replace', props.index, value[0]);
  }
});
</script>

<template>
  <VueDraggable class="placement" v-model="children" :group="{name: 'renderer', put: true}" :sort="false">
    <n-icon class="plus-icon" size="24" color="#0e7a0d">
      <PlusFilled/>
    </n-icon>
  </VueDraggable>
</template>

<style scoped lang="scss">
.placement {
  width: 100%;
  height: 100%;
  position: relative;

  .plus-icon {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
}
</style>