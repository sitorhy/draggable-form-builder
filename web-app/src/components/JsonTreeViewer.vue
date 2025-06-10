<script setup lang="ts">
import {useRendererStore} from "../store.ts";
import {computed, h} from "vue";
import type {TreeOption} from "naive-ui";
import {NIcon} from 'naive-ui';
import {FolderOutlined, FolderRound} from '@vicons/material';

const store = useRendererStore();

function mapTreeOption(layouts: ReadonlyArray<TreeOption>): TreeOption[] {
  return layouts.map((i) => {
    return {
      label: i.id === '#' ? '跟容器' : i.type,
      id: i.id,
      children: Array.isArray(i.children) ? mapTreeOption(i.children) : [],
      prefix: () =>
          h(NIcon, null, {
            default: () => h(FolderOutlined)
          }),
    }
  });
}

function updatePrefixWithExpaned(
    _keys: Array<string | number>,
    _option: Array<TreeOption | null>,
    meta: {
      node: TreeOption | null
      action: 'expand' | 'collapse' | 'filter'
    }
) {
  if (!meta.node)
    return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
          h(NIcon, null, {
            default: () => h(FolderRound)
          })
      break
    case 'collapse':
      meta.node.prefix = () =>
          h(NIcon, null, {
            default: () => h(FolderOutlined)
          })
      break
  }
}

const data = computed(() => mapTreeOption([store.data]));
</script>

<template>
  <n-tree
      :data="data"
      block-line
      expand-on-click
      key-field="id"
      label-field="label"
      children-field="children"
      :on-update:expanded-keys="updatePrefixWithExpaned"
  />
</template>