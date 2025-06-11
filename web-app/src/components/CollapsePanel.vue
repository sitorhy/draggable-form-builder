<script setup lang="ts">
import {ChevronLeftFilled, ChevronRightFilled} from '@vicons/material';
import {computed} from "vue";

const props = defineProps({
  width: {
    type: [Number, String],
    default: '0px',
  },
  rightToLeft: {
    type: Boolean,
    default: true,
  }
});

const modelValue = defineModel('modelValue', {
  default: true,
});

const contentStyle = computed(function () {
  return {
    width: modelValue.value ? props.width : 0,
    minWidth: `0px`,
    overflow: 'auto',
  };
});

const slotStyle = computed(function () {
  return {
    width: props.width,
    height: '100%',
  };
});

const contentClasses = computed(function () {
  return [modelValue.value ? null : 'collapsed'].filter(Boolean).join(' ');
});

const contentBorderClasses = computed(function () {
  return props.rightToLeft ? 'bordered-left' : 'bordered-right';
});

function onCollapseToggle() {
  modelValue.value = !modelValue.value;
}
</script>

<template>
  <div class="collapse-panel" :class="contentBorderClasses">
    <div class="content-border">
      <div class="content" :class="contentClasses" :style="contentStyle">
        <div :style="slotStyle">
          <slot></slot>
        </div>
      </div>
    </div>
    <div @click="onCollapseToggle" class="collapse-button">
      <n-icon size="24">
        <template v-if="rightToLeft">
          <ChevronLeftFilled v-if="modelValue"/>
          <ChevronRightFilled v-else/>
        </template>
        <template v-else>
          <ChevronRightFilled v-if="modelValue"/>
          <ChevronLeftFilled v-else/>
        </template>
      </n-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collapse-panel {
  position: relative;
  height: 100%;
  display: flex;

  &.bordered-right {
    flex-direction: row-reverse;
  }

  .content-border {
    width: 100%;
    height: 100%;
  }

  .content {
    width: 200px;
    height: 100%;
    transition: all 0.3s;

    &.collapsed {
      opacity: 0;
    }
  }
}

.collapse-button {
  width: 24px;
  display: flex;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    background-color: #eeeeee;
  }
}

.bordered-left .collapse-button {
  border-right: solid 1px lightgrey;
}

.bordered-right .collapse-button {
  border-left: solid 1px lightgrey;
}
</style>