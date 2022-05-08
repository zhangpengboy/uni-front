<template>
  <div id="app">
    <!-- view router -->
    <van-nav-bar
      v-if="ShowBarFlag"
      :title="$route.meta.title"
      :right-text="$route.meta.text"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <navigation>
      <router-view />
    </navigation>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FooterLogo from '@/components/FooterLogo.vue'
/* eslint-disable */
const HideNavBarRouterNameArray = [
  "popedomList",
  "popedomDetails",
  "earningsDetails",
  "agentApply",
  "center",
  "myTeam",
  "myRaword",
  "myRawordDetail",
  "subgroup",
  "mchType",
  "accountType",
  "storeRegister",
];
export default {
  components: {
    FooterLogo,
  },
  data() {
    return {
      ShowBarFlag: false,
      HideNavBarRouterNameArray,
      show: false,
      active: 0,
      icon: [],
    };
  },
  computed: {
    ...mapState(['isApp']),
  },
  watch: {
    // $route(to, from) {
    //   this.ShowBarFlag = !(
    //     _.indexOf(this.HideNavBarRouterNameArray, to.name) > -1
    //   );
    // },
  },
  created() {
    this.setfont();
    this.$navigation.on("forward", (to, from) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });
    this.$navigation.on("back", (to, from) => {});
    this.$navigation.on("replace", (to, from) => {});
    this.$navigation.on("refresh", (to, from) => {});
    this.$navigation.on("reset", () => {
      // 刷新清除记录
      this.$navigation.cleanRoutes();
    });
    console.log(this.isApp);
  },
  methods: {
    setfont() {
      if (
        typeof WeixinJSBridge === "object" &&
        typeof WeixinJSBridge.invoke === "function"
      ) {
        handleFontSize();
      } else {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            handleFontSize,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", handleFontSize);
          document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
      }

      function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on("menu:setfont", function () {
          WeixinJSBridge.invoke("setFontSizeCallback", { fontSize: 0 });
        });
      }
    },
    onClickLeft() {
      this.$baseUtils.goBack(-1);
    },
  },
};
</script>

<style lang="scss">
// TODO 正式发布前注释
@import "~@/assets/scss/base/reset.min.css";

body {
  background: #ffff;
  -webkit-text-size-adjust: 100% !important;
}
#app {
  font-size: 16px;
  height: 100%;
  width: 100%;
  // background: #f4f4f4;
  -webkit-overflow-scrolling: touch;
}

.iconImage {
  width: 25px !important;
  height: 25px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@import "./assets/scss/js-base";
@import "./assets/scss/base/eidt-vant-base";
@import "./assets/scss/main";
</style>