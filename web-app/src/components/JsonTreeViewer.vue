<script setup lang="ts">
import {useRendererStore} from "../store.ts";
import {computed, h, ref, watch, withModifiers} from "vue";
import type {TreeOption} from "naive-ui";
import {NIcon, NButton, NButtonGroup} from "naive-ui";
import {
  Collections20Regular,
  Collections24Filled,
  Settings24Filled
} from "@vicons/fluent";
import type {RendererLayout} from "../types";
import {getComponentNameByType, getIconByType} from "../common/renderer.ts";

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

function mapTreeOption(layouts: RendererLayout[]): TreeOption[] {
  return layouts.map((i) => {
    return {
      key: i.id,
      label: getComponentNameByType(i.type),
      children: !i.isLeaf
          ? mapTreeOption(Array.isArray(i.children) ? i.children : [])
          : undefined,
      prefix: function () {
        return h(NIcon, null, {
          default: () => h(i.isLeaf ? getIconByType(i.type) : Collections20Regular),
        });
      },
      suffix: () =>
          h(
              NButtonGroup,
              {},
              () => {
                const children = [];
                if (i.isLeaf) {
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
                            }, ['stop'])
                          },
                          {default: () => h(NIcon, {}, () => h(Settings24Filled))}
                      )
                  );
                }
                return children
              }
          )
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
            default: () => h(Collections24Filled),
          });
      break;
    case "collapse":
      meta.node.prefix = () =>
          h(NIcon, null, {
            default: () => h(Collections20Regular),
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
      block-line
      expand-on-click
      key-field="key"
      label-field="label"
      children-field="children"
      :default-expanded-keys="defaultExpandedKeys"
      :default-selected-keys="defaultSelectedKeys"
      :selected-keys="defaultSelectedKeys"
      :on-update:expanded-keys="updatePrefixWithExpand"
      :on-update:selected-keys="onSelectedKeysUpdate"
  />
</template>
