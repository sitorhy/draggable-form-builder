<script setup lang="ts">
import {computed} from "vue";
import {getIconByType} from "../../store/component.ts";

const props = defineProps({
  label: {
    type: String,
    default: 'Label',
  },
  type: {
    type: String,
    default: '',
  }
});

const Icon = computed(() => getIconByType(props.type));
</script>

<template>
  <div class="tag">
    <n-icon class="icon" :component="Icon"/>
    <span>{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.icon {
  display: flex;
  margin: 0 4px 0 0;
  color: #18a058;
  font-size: 14px;
}

.tag {
  box-sizing: border-box;
  user-select: none;
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  padding: 0 7px;
  border-radius: 2px;
  color: #18a058;
  background-color: rgba(24, 160, 88, 0.12);
  border: 1px solid rgba(24, 160, 88, 0.3);
  height: 28px;
  font-size: 14px;

  &.drag {
    > .icon {
      display: none;
      color: #f0a020;
    }

    justify-content: center;
    background-color: rgba(240, 160, 32, 0.12);
    border: 1px solid rgba(240, 160, 32, 0.35);
    color: #f0a020;
  }

  &.ghost {
    background: rgba(88, 214, 33, 0.3);
  }
}

.renderer-drop .tag {
  min-width: 124px;

  > .icon {
    display: none;
    color: #f0a020;
  }

  justify-content: center;
  background-color: rgba(240, 160, 32, 0.12);
  border: 1px solid rgba(240, 160, 32, 0.35);
  color: #f0a020;
}
</style>