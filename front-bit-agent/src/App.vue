<template>
  <div id="app">
    <van-nav-bar
      v-if="ShowBarFlag"
      :title="$route.meta.title"
      left-text=""
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <router-view />
    <!-- <router-view v-slot="{ Component }">
      <transition name="fade">
        <keep-alive >
          <component class="view" :is="Component" />
        </keep-alive>
      </transition>
    </router-view> -->
    <template
      v-if="
        $route.name == 'home' ||
        $route.name == 'commission' ||
        $route.name == 'user'
      "
    >
      <van-tabbar route fixed placeholder>
        <van-tabbar-item replace to="/home" icon="friends"
          >团队管理</van-tabbar-item
        >
        <van-tabbar-item replace to="/commission" icon="bill"
          >佣金管理</van-tabbar-item
        >
        <van-tabbar-item replace to="/user" icon="manager"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </template>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
const HideNavBarRouterNameArray = [
  "home",
  "user",
  "commission",
  "login",
  // "cardList",
  "withdraw",
];
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const ShowBarFlag = ref(false);
    const onClickLeft = () => router.back();
    watch(
      () => route.name,
      (toName) => {
        ShowBarFlag.value = !(
          _.indexOf(HideNavBarRouterNameArray, toName) > -1
        );
      }
    );
    return {
      onClickLeft,
      ShowBarFlag,
    };
  },
};
</script>
<style lang="scss">
@import "~@/assets/scss/base/reset.min.css";
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
@import "./assets/scss/js-base";
@import "./assets/scss/base/eidt-vant-base";
@import "./assets/scss/main";
</style>
