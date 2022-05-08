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
    <!-- <transition name="fade">

    </transition> -->
    <navigation>
      <router-view />
    </navigation>
    <!-- show tabber router name -->
    <!-- <template v-if="$route.name == 'alliance' || $route.name == 'usdt' || $route.name == 'center' || $route.name == 'storage'">
      <van-tabbar v-model="active" route >
        <van-tabbar-item
          v-for="(item, index) in icon"
          :key="index"
          :to="item.url"
        >
          <span class="fs-12">{{ item.tabBar }}</span>
          <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? item.active : item.normal"
            class="iconImage"
          />
        </van-tabbar-item>
      </van-tabbar>
    </template> -->
  </div>
</template>

<script>
/* eslint-disable */
const HideNavBarRouterNameArray = [
  "exchange",
  "hometown",
  "login",
  "shopping",
  "my",
  "myQR",
  "giftCer",
  "siteEdit",
  "site",
  "set",
  "author",
  "orderDetail",
  "search",
  "accomplish",
  "orderList",
  "salesmanSetup",
  "giftMother",
  "giftMotherBackstage",
  "wallet",
  "retroactive",
  "aiipay",
  "storeOrderDetails",
  // 'brand',
  // 'submitOrder'
  // 'commodity',
];

export default {
  data() {
    return {
      ShowBarFlag: false,
      HideNavBarRouterNameArray,
      show: false,
      active: 0,
      isApp: false,
    };
  },
  watch: {
    $route(to, from) {
      this.ShowBarFlag = !(
        _.indexOf(this.HideNavBarRouterNameArray, to.name) > -1
      );
    },
  },
  created() {
    this.setfont();
    this.$navigation.on("forward", (to, from) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });
    this.$navigation.on("back", (to, from) => {});
    this.$navigation.on("replace", (to, from) => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });
    this.$navigation.on("refresh", (to, from) => {});
    this.$navigation.on("reset", () => {
      // 刷新清除记录
      this.$navigation.cleanRoutes();
    });
    // 进入首页定位
    this.getTencentLocation();
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
    // 返回上一级
    onClickLeft() {
      this.$baseUtils.goBack(-1);
    },
    // * 获取腾讯地区定位
    getTencentLocation() {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_HESIGN,
        {
          url: window.location.href,
        },
        (res) => {
          this.$wxApi.wxLocation(
            res.data,
            (reps) => {
              console.log("当前腾讯GPS定位经纬度");
              console.log("longitude: " + reps.longitude + ",latitude:" + reps.latitude);
              console.log("当前腾讯GPS定位经纬度");

              let result = this.$gcoord.transform(
                [reps.longitude, reps.latitude], // 经纬度坐标
                this.$gcoord.WGS84, // 当前坐标系
                // this.$gcoord.GCJ02, // 当前坐标系
                this.$gcoord.BD09 // 目标坐标系
              );
              // let _point = {
              //   lng: result[0],
              //   lat: result[1]
              // }
              console.log("工具转百度地图坐标经纬度");
              console.log("longitude: " + result[0] + ",latitude:" + result[1]);
              console.log("工具转百度地图坐标经纬度");
              // this.getBMapGeocoder(_point)
              this.getLocation(result[1], result[0]);
            },
            () => {
              // 定位失败
            }
          );
        }
      );
    },
    // * 获取
    getLocation(lat, lng) {
      this.$http.post(
        this.$apiUri.APP_STORELOCATION_INFO_GET,
        { lat: lat.toString(), lng: lng.toString() },
        (res) => {
          // TODO 记得保存其他信息 本地街市会用到
          this.$lance.setData("townCode", res.data.addressComponent.town_code);
        },
        (err) => {
          this.$toast(err.message);
        }
      );
    },
  },
};
</script>

<style lang="scss">
// TODO 正式发布前注释
@import "~@/assets/scss/base/reset.min.css";

body {
  background: #f8f8f8;
  -webkit-text-size-adjust: 100% !important;
}
#app {
  font-size: 16px;
  height: 100%;
  width: 100%;
  background: #f8f8f8;
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
