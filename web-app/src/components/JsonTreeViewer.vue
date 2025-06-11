<script setup lang="ts">
import { useRendererStore } from "../store.ts";
import { computed, h } from "vue";
import type { TreeOption } from "naive-ui";
import { NIcon } from "naive-ui";
import {
  FolderOutlined,
  FolderRound,
  AttachFileFilled,
} from "@vicons/material";

const store = useRendererStore();

function mapTreeOption(layouts: RendererLayout[]): TreeOption[] {
  return layouts.map((i) => {
    return {
      key: i.id,
      label: i.id === "#" ? "根容器" : i.type,
      children: !i.isLeaf
        ? mapTreeOption(Array.isArray(i.children) ? i.children : [])
        : undefined,
      prefix: function () {
        return h(NIcon, null, {
          default: () => h(i.isLeaf ? AttachFileFilled : FolderOutlined),
        });
      },
    };
  });
}

function updatePrefixWithExpaned(
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) {
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderRound),
        });
      break;
    case "collapse":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOutlined),
        });
      break;
  }
}

const data = computed(() => mapTreeOption([store.data]));
</script>

<template>
  <n-tree
    :data="data"
    block-line
    expand-on-click
    key-field="key"
    label-field="label"
    children-field="children"
    :on-update:expanded-keys="updatePrefixWithExpaned"
  />
</template>
