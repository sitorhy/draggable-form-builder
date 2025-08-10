<script setup lang="ts">

</script>

<template>
  <div class="main">
    <n-layout position="absolute">
      <n-layout-header style="height: 64px; padding: 0 11px;" bordered>
        <div style="height: 100%; display: flex; align-items: center;">
          <n-page-header subtitle="让你的听觉更懂视觉">
            <template #title>
              <a href="https://anyway.fm/" style="text-decoration: none; color: inherit">Anyway.FM</a>
            </template>
            <template #avatar>
              <n-avatar
                  src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
              />
            </template>
          </n-page-header>
        </div>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
        <n-layout-sider
            collapse-mode="transform"
            :collapsed-width="11"
            :native-scrollbar="false"
            :width="240"
            content-style="padding: 11px;"
            show-trigger="arrow-circle"
            bordered
        >
          <div style="width: 100%; height: 1000px; background: aqua">
          </div>
        </n-layout-sider>

        <n-layout has-sider sider-placement="right">
          <n-layout-content embedded content-style="padding: 24px; 11px;" :native-scrollbar="false">
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
            <n-h2>平山道</n-h2>
          </n-layout-content>

          <n-layout-sider
              collapse-mode="transform"
              :native-scrollbar="false"
              :collapsed-width="11"
              :width="240"
              content-style="padding: 11px;"
              show-trigger="arrow-circle"
              bordered
          >
            <div style="width: 100%; height: 1000px; background: aqua">
            </div>
          </n-layout-sider>
        </n-layout>
      </n-layout>
      <n-layout-footer
          bordered
          position="absolute"
          style="height: 64px; padding: 24px"
      >
        城府路
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  width: 100%;
}
</style>