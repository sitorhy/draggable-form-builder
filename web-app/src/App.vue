<script setup lang="ts">
import {ref} from "vue";
import logo from "./assets/vue.svg"
import CollapsePanel from "./components/CollapsePanel.vue"
import ComponentCollapse from "./components/ComponentCollapse.vue"
import JsonRenderer from "./components/JsonRenderer.vue"
import SettingsPanel from "./components/SettingsPanel.vue"
import {useRendererStore} from "./store.ts";

const rendererStore = useRendererStore();

const leftContentExpanded = ref(true);
const rightContentExpanded = ref(true);

</script>

<template>
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
