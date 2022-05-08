<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-20 18:54:25
 * @Description : APP 首页
-->
<template>
  <div id="app">
    <!-- 顶部 -->
    <AppHeader />
    <!-- 路由 -->
    <div class="app-main">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <!-- 底部 -->
    <AppFooter />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppHeader from '@/components/header/index.vue';
import AppFooter from '@/components/footer/index.vue';
export default Vue.extend({
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {};
  },
});
</script>
<style lang="less">
html,
body {
  background-color: #f6f6f6;
}
#app {
  min-width: 1280px;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
  background: #f6f6f6;
}
.app-main {
  padding-top: 88px;
  min-height: calc(100vh - 320px);
}
@import '~@/assets/less/reset.less';
@import '~@/assets/less/main.less';
</style>
