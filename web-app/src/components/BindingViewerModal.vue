<script setup lang="ts">
import {useBindingStore} from "../store.ts";
import JsonEditorVue from 'json-editor-vue';
import * as dotProp from "dot-prop";
import {ref, nextTick, watch} from "vue";

const bindingStore = useBindingStore();

const showBindingViewer = defineModel('modelValue', {
  type: Boolean,
  default: false
});

const bindingJson = ref({});
const redo = ref<{
  path: string;
  op: string;
  value: any;
}[]>([]);

watch(showBindingViewer, (value: boolean) => {
  if (value) {
    nextTick(async () => {
      bindingJson.value = new Proxy(bindingStore.cloneState(), {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target: any | Record<string, any>, p: string | symbol, newValue: any, receiver: any): boolean {
          return Reflect.set(target, p, newValue, receiver);
        }
      });
    });
  } else {
    for (const i of redo.value) {
      const {op, path, value} = i;
      switch (op) {
        case 'replace':
          dotProp.setProperty(bindingStore.state, (path as string || '').split('/').filter((i: string) => !!i).join('.'), value);
          break;
      }
    }
  }
});

function onChange(_value: {
  json: any,
  text: string,
}, _oldValue: {
  json: any,
  text: string,
}, patch: {
  patchResult: {
    redo: {
      path: string;
      op: string;
      value: any;
    }[]
  }
}) {
  const patchResult = patch.patchResult;
  patchResult.redo.forEach((patch: {
    path: string;
    op: string;
    value: any;
  }) => {
    const {op, path, value} = patch;
    const redoItem = redo.value.find((i) => i.path === path);
    if (redoItem) {
      redoItem.value = value;
    } else {
      redo.value.unshift({op, path, value});
    }
  });
}

</script>

<template>
  <n-modal v-model:show="showBindingViewer">
    <n-card
        style="width: 80%"
        title="绑定域"
        :bordered="false"
        role="dialog"
        aria-modal="true"
    >
      <JsonEditorVue
          class="json-editor"
          v-model="bindingJson"
          @change="onChange"
          mode="tree"
      />
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
.json-editor {
  width: 100%;
}
</style>