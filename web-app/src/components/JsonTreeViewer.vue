<script setup lang="ts">
import {useRendererStore} from "../store.ts";
import {computed, h, ref, watch, withModifiers} from "vue";
import type {TreeOption} from "naive-ui";
import {v4 as uuid} from "uuid";
import {NIcon, NButton, NButtonGroup} from "naive-ui";
import {
  Settings24Filled,
  Folder24Regular,
  FolderOpen24Regular,
} from "@vicons/fluent";
import {
  CenterFocusStrongRound
} from "@vicons/material";
import type {RendererLayout} from "../types";
import {getComponentNameByType, getIconByType} from "../common/renderer.ts";

const emit = defineEmits(['setting:click']);
const store = useRendererStore();

const defaultSelectedKeys = ref<string[]>([]);
const defaultExpandedKeys = ref<string[]>([]);

watch(function () {
  return store.activeRendererItemInfo.ancestors;
}, function () {
  const expandedKeys = store.activeRendererItemInfo.ancestors.map((i) => i.id);
  defaultExpandedKeys.value = [...new Set([...defaultExpandedKeys.value, ...expandedKeys])];
});

watch(function () {
  return store.activeRendererItemInfo.ancestors;
}, function () {
  const expandedKeys = store.activeRendererItemInfo.ancestors.map((i) => i.id);
  defaultExpandedKeys.value = [...new Set([...defaultExpandedKeys.value, ...expandedKeys])];
});

watch(function () {
  return store.activeRendererItemInfo.id;
}, function () {
  defaultSelectedKeys.value = [store.activeRendererItemInfo.id];
});

function mapTreeOption(layouts: (RendererLayout | string)[]): TreeOption[] {
  return layouts.map((i) => {
    if (typeof i === "string") {
      return {
        key: uuid(),
        label: `"${i}"`
      }
    }
    return {
      key: i.id,
      label: getComponentNameByType(i.type),
      children: Array.isArray(i.children) && i.children.length
          ? mapTreeOption(i.children)
          : undefined,
      prefix: function () {
        return h(NIcon, null, {
          default: () => h(!Array.isArray(i.children) ? getIconByType(i.type) : Folder24Regular),
        });
      },
      suffix: () => {
        if (i.outline && Object.keys(i.outline).length > 0) {
          return h(
              NButtonGroup,
              {
                size: 'large'
              },
              () => {
                const children = [];
                if (i.outline?.focus) {
                  children.push(
                      h(
                          NButton,
                          {
                            title: '高亮',
                            text: true,
                            type: 'primary',
                            onClick: withModifiers(function () {
                              defaultSelectedKeys.value = [i.id];
                              store.setActiveComponent(i.id);
                            }, ['stop'])
                          },
                          {default: () => h(NIcon, {}, () => h(CenterFocusStrongRound))}
                      )
                  );
                }
                if (i.outline?.setting) {
                  children.push(
                      h(
                          NButton,
                          {
                            title: '设置',
                            text: true,
                            type: 'primary',
                            onClick: withModifiers(function () {
                              defaultSelectedKeys.value = [i.id];
                              store.setActiveComponent(i.id);
                              emit('setting:click');
                            }, ['stop'])
                          },
                          {default: () => h(NIcon, {}, () => h(Settings24Filled))}
                      )
                  );
                }
                return h(NButtonGroup, {}, () => children);
              }
          );
        } else {
          return null;
        }
      }
    };
  });
}

function updatePrefixWithExpand(
    _keys: Array<string>,
    _option: Array<TreeOption | null>,
    meta: {
      node: TreeOption | null;
      action: "expand" | "collapse" | "filter";
    }
) {
  defaultExpandedKeys.value = [..._keys];
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
          h(NIcon, null, {
            default: () => h(FolderOpen24Regular),
          });
      break;
    case "collapse":
      meta.node.prefix = () =>
          h(NIcon, null, {
            default: () => h(Folder24Regular),
          });
      break;
  }
}

function onSelectedKeysUpdate(keys: string[]) {
  store.setActiveComponent(keys.length ? keys[0] : "");
  defaultSelectedKeys.value = [...keys];
}

const data = computed(() => mapTreeOption([store.data]));
</script>

<template>
  <n-tree
      :data="data"
      expand-on-click
      key-field="key"
      label-field="label"
      children-field="children"
      :block-line="true"
      :block-node="true"
      :scrollbar-props="{xScrollable: true}"
      :default-expanded-keys="defaultExpandedKeys"
      :default-selected-keys="defaultSelectedKeys"
      :selected-keys="defaultSelectedKeys"
      :on-update:expanded-keys="updatePrefixWithExpand"
      :on-update:selected-keys="onSelectedKeysUpdate"
  />
</template>
