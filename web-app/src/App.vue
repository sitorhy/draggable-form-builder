<script setup lang="ts">
import {ref} from "vue";
import logo from "./assets/vue.svg"
import CollapsePanel from "./components/CollapsePanel.vue"
import ComponentCollapse from "./components/ComponentCollapse.vue"
import JsonRenderer from "./components/naive-ui-renderer/JsonRenderer.vue"
import SettingsPanel from "./components/SettingsPanel.vue"
import {useRendererStore} from "./store.ts";
import {JsonViewer} from "vue3-json-viewer";

const rendererStore = useRendererStore();
const leftContentExpanded = ref(true);
const rightContentExpanded = ref(true);
const showJsonViewer = ref(false);

function switchJsonViewer() {
  showJsonViewer.value = !showJsonViewer.value;
}

</script>

<template>
  <n-notification-provider>
    <n-config-provider>
      <n-modal-provider>
        <n-dialog-provider>
          <n-message-provider>
            <div class="main">
              <n-page-header class="header" subtitle="">
                <template #title>
                  <div>Low-Code Demo</div>
                </template>
                <template #avatar>
                  <n-avatar
                      color="transparent"
                      :src="logo"
                  />
                </template>
                <template #extra>
                  <n-space>
                    <n-button @click="switchJsonViewer">JSON</n-button>
                  </n-space>
                </template>
              </n-page-header>
              <div class="content">
                <div class="content-left">
                  <CollapsePanel v-model="leftContentExpanded" width="20vw">
                    <ComponentCollapse/>
                  </CollapsePanel>
                </div>
                <div class="content-center">
                  <JsonRenderer v-model="rendererStore.data"/>
                </div>
                <div class="content-right">
                  <CollapsePanel :right-to-left="false" v-model="rightContentExpanded" width="20vw">
                    <SettingsPanel/>
                  </CollapsePanel>
                </div>
              </div>
              <n-drawer v-model:show="showJsonViewer" width="50%">
                <n-drawer-content title="JSON">
                  <JsonViewer :copyable="{copyText: '复制', copiedText:'已复制'}" :value="rendererStore.data"
                              theme="light"
                              :expand-depth="5"/>
                </n-drawer-content>
              </n-drawer>
            </div>
          </n-message-provider>
        </n-dialog-provider>
      </n-modal-provider>
    </n-config-provider>
  </n-notification-provider>
</template>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  .header {
    box-shadow: 0 2px 2px lightgrey;
    padding: 5px;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;

    .content-left {
      height: 100%;
    }

    .content-center {
      flex: 1;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
    }

    .content-right {
      height: 100%;
    }
  }
}
</style>
