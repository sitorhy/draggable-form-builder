<script setup lang="ts">
import {computed} from 'vue';
const props = defineProps({
  options: {
    type: Array,
    default: () => [
      {
        label: "px",
        value: "px",
      },
      {
        label: "em",
        value: "em",
      },
      {
        label: "%",
        value: "%",
      }
    ],
  },
  modelValue: {
    type: String,
    default: "",
  },
  direction: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(['update:modelValue']);

const num = computed(() => {
  const value = Number.parseInt(props.modelValue);
  if (Number.isNaN(value)) {
    return 0;
  }
  return value;
});

const unit = computed(() => {
  const m = (props.modelValue || '').match(/(\d+)(.*)/);
  return m && m[2] ? m[2] : "px";
});

function onNumUpdate(value: number) {
  emit('update:modelValue', `${value}${unit.value}`);
}

function onUnitUpdate(value: string) {
  emit('update:modelValue', `${num.value}${value}`);
}
</script>

<template>
  <div :class="['container', 'size-property']">
    <n-input-number placeholder="" :value="num" @update:value="onNumUpdate" class="num" size="tiny" :bordered="false" :precision="0" :step="1" :show-button="false"/>
    <n-select placeholder="" :consistent-menu-width="false" :value="unit" :show-arrow="false" @update:value="onUnitUpdate" class="unit" size="tiny" :bordered="false" :options="options"/>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;

  &.horizontal {
    flex-direction: row;
  }

  &.vertical {
    flex-direction: column;
  }

  .num {
    width: 3em;
    text-align: right;
  }

  .unit {
    width: 3em;
    padding-left: 0;
  }
}
</style>

<style>
.size-property {
  .n-base-selection-label {
    background: none;
  }
  .n-base-selection-input {
    padding: 0 !important;
    background: none !important;
  }

  .n-input-wrapper {
    padding: 0;
    background: none !important;
  }

  .n-input {
    background: none;
  }
}
</style>