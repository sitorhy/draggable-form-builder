<script setup lang="ts">
import {computed, h, ref} from "vue";
import {NIcon} from 'naive-ui';
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import logo from "./assets/vue.svg"
import CollapsePanel from "./components/CollapsePanel.vue"
import ComponentCollapse from "./components/ComponentCollapse.vue"
import JsonRenderer from "./components/naive-ui-renderer/JsonRenderer.vue"
import SettingsPanel from "./components/SettingsPanel.vue"
import {useRendererStore} from "./store.ts";
import {Settings24Regular, Braces24Filled, CubeTree24Regular, Database24Regular, MathFormula24Regular, DataWhisker24Regular} from '@vicons/fluent';
import JsonViewerModal from "./components/JsonViewerModal.vue";
import JsonTreeViewer from "./components/JsonTreeViewer.vue";
import DatasourceTable from "./components/DatasourceTable.vue";
import FunctionDialog from "./components/FunctionDialog.vue";
import BindingViewerModal from "./components/BindingViewerModal.vue";

hljs.registerLanguage('json', json);

const rendererStore = useRendererStore();
const leftContentExpanded = ref(true);
const rightContentExpanded = ref(true);
const showJsonViewer = ref(false);
const showOuting = ref(false);
const showDatasourceTable = ref(false);
const showBindingViewer = ref(false);
const showFunctionTable = ref(false);

function switchJsonViewer() {
  showJsonViewer.value = !showJsonViewer.value;
}

function switchBindingViewer() {
  showBindingViewer.value = !showBindingViewer.value;
}


const menuOptions = computed(function () {
  return [
    {
      label: '数据集',
      icon() {
        return h(NIcon, null, {
          default: () => h(Database24Regular)
        })
      },
      key: 'datasource'
    },
    {
      label: '函数集',
      icon() {
        return h(NIcon, null, {
          default: () => h(MathFormula24Regular)
        });
      },
      key: 'function'
    },
    {
      label: 'JSON Viewer',
      icon() {
        return h(NIcon, null, {
          default: () => h(Braces24Filled)
        })
      },
      key: 'json'
    },
    {
      label: '绑定域',
      icon() {
        return h(NIcon, null, {
          default: () => h(DataWhisker24Regular)
        })
      },
      key: 'binding'
    },
  ];
});

function handleMenuSelect(key: string): void {
  switch (key) {
    case "json": {
      switchJsonViewer();
    }
      break;
    case "datasource": {
      showDatasourceTable.value = !showDatasourceTable.value;
    }
      break;
    case "function": {
      showFunctionTable.value = !showFunctionTable.value;
    }
      break;
    case "binding": {
      switchBindingViewer();
    }
      break;
  }
}

function onOutlineClick() {
  showOuting.value = !showOuting.value;
}

</script>

<template>
  <n-notification-provider>
    <n-config-provider :hljs="hljs">
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
                    <n-button @click="onOutlineClick">
                      <template #icon>
                        <n-icon>
                          <CubeTree24Regular/>
                        </n-icon>
                      </template>
                      <span>大纲</span>
                    </n-button>
                    <n-dropdown :options="menuOptions" @select="handleMenuSelect" trigger="click">
                      <n-button>
                        <template #icon>
                          <n-icon>
                            <Settings24Regular/>
                          </n-icon>
                        </template>
                        <span>设置</span>
                      </n-button>
                    </n-dropdown>
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
            </div>

            <n-drawer :show-mask="false" display-directive="show" v-model:show="showOuting" :show-line="true" default-width="30%" placement="right" resizable>
              <n-drawer-content title="大纲视图" closable>
                <div style="min-width: 400px; overflow: auto;">
                  <JsonTreeViewer @setting:click="onOutlineClick"/>
                </div>
              </n-drawer-content>
            </n-drawer>

            <JsonViewerModal v-model="showJsonViewer"/>
            <BindingViewerModal v-model="showBindingViewer"/>
            <DatasourceTable v-model="showDatasourceTable" />
            <FunctionDialog v-model="showFunctionTable"/>
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