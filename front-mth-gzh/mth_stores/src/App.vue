<template>
  <div id="app">
    <!-- view router -->
    <van-nav-bar v-if="ShowBarFlag"
                 :title="$route.meta.title"
                 :right-text="$route.meta.text"
                 left-arrow
                 fixed
                 placeholder
                 @click-left="onClickLeft" />
    <!-- <transition name="fade">

    </transition> -->
    <navigation>
      <router-view />
    </navigation>
    <!-- show tabber router name -->
    <template v-if="$route.name == 'goods' || $route.name == 'order' || $route.name == 'market' || $route.name == 'my'">
      <van-tabbar v-model="active"
                  route
                  active-color="#EB6133"
                  inactive-color="#333333">
        <van-tabbar-item v-for="(item, index) in icon"
                         :key="index"
                         :to="item.url">
          <span class="fs-12">{{ item.tabBar }}</span>
          <img slot="icon"
               slot-scope="props"
               :src="props.active ? item.active : item.normal"
               class="iconImage" />
        </van-tabbar-item>
      </van-tabbar>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
const HideNavBarRouterNameArray = [
  'goods',
  'order',
  'market',
  'my',
  'updateStoreName',
  'addGoods',
  'orderDetails',
  'purchase',
  'shoppingGoods',
  'addStoreGoodsBase',
  'mallOrderList',
  'storeOrderList',
  'storeOrderDetails'
]

export default {
  data () {
    return {
      ShowBarFlag: false,
      HideNavBarRouterNameArray,
      show: false,
      active: 0,
      isApp: false,
      icon: [
        {
          tabBar: "商品管理",
          url: "/goods",
          normal: require("@/assets/images/tabbar/goods_off@2x.png"),
          active: require("@/assets/images/tabbar/goods_on@2x.png"),
        },
        {
          tabBar: "订单管理",
          url: "/order",
          normal: require("@/assets/images/tabbar/order_off@2x.png"),
          active: require("@/assets/images/tabbar/order_on@2x.png"),
        },
        {
          tabBar: "营销管理",
          url: "/market",
          normal: require("@/assets/images/tabbar/market_off@2x.png"),
          active: require("@/assets/images/tabbar/market_on@2x.png"),
        },
        {
          tabBar: "个人",
          url: "/my",
          normal: require("@/assets/images/tabbar/my_off@2x.png"),
          active: require("@/assets/images/tabbar/my_on@2x.png"),
        },
      ]
    }
  },
  watch: {
    $route (to, from) {
      if (this.$store.state.storeQuery.type) {
        this.ShowBarFlag = false
      } else {
        this.ShowBarFlag = !(
          _.indexOf(this.HideNavBarRouterNameArray, to.name) > -1
        )
      }
    }
  },
  created () {
    // console.log(this.$store.state.storeQuery);
    this.setfont()
    this.$navigation.on('forward', (to, from) => {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    })
    this.$navigation.on('back', (to, from) => { })
    this.$navigation.on('replace', (to, from) => { })
    this.$navigation.on('refresh', (to, from) => { })
    this.$navigation.on('reset', () => {
      // 刷新清除记录
      this.$navigation.cleanRoutes()
    })
  },
  methods: {
    setfont () {
      if (
        typeof WeixinJSBridge === 'object' &&
        typeof WeixinJSBridge.invoke === 'function'
      ) {
        handleFontSize()
      } else {
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            handleFontSize,
            false
          )
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', handleFontSize)
          document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
        }
      }

      function handleFontSize () {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 })
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
          WeixinJSBridge.invoke('setFontSizeCallback', { fontSize: 0 })
        })
      }
    },
    // 返回上一级
    onClickLeft () {
      this.$baseUtils.goBack(-1)
    }
  }
}
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
