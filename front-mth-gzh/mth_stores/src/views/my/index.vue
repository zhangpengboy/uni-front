<!-- 个人中心 -->
<template>
  <div class='my'>
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="userInfo d-flex flex-column justify-content-between">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <img class="autor" src="@/assets/images/logo.png" alt="">
          <div class="ml-2">
            <div class="d-flex align-items-center mb-1">
              <p class="name fs-16 color-white">{{ userInfo.storeName ? userInfo.storeName : '' }}</p>
              <div class="cutButtom ml-1" @click="toPage('storeSelect')">
                <span>{{ userInfo.storeRoleName }}</span>
                <img class="cut" src="@/assets/images/my/cut@2x.png" alt="">
              </div>
            </div>
            <p class="fs-14 color-white">{{ $lance.getData('phone') }}</p>
          </div>
        </div>
        <img class="setIcon" src="@/assets/images/my/set@2x.png" alt="" @click="toPage('set')">
      </div>
      <div class="d-flex justify-content-between mx-4">
        <div class="bottom" @click="toPage('assetsIndex')">
          <p class="fs-20 color-white mb-1">{{ allAmount }}</p>
          <p class="fs-13 pcolor">资产（元）</p>
        </div>
        <div class="bottom" @click="toPage('giftLog')">
          <p class="fs-20 color-white mb-1">{{ gift }}</p>
          <p class="fs-13 pcolor">礼券（个）</p>
        </div>
      </div>
    </div>
    <!-- <div class="stockOrder">
      <van-cell
        title="进货订单"
        is-link
        value="全部订单"
        to="/orderList"
        :border="false"
      />
      <van-grid :border="false">
        <van-grid-item
          v-for="(v, i) in mybarList"
          :key="i"
          @click="toPage(v.url, v.code)"
          :icon="v.icon"
          :text="v.text"
        />
      </van-grid>
    </div> -->
    <!-- <div class="serve">
      <van-grid :border="false">
        <van-grid-item
          v-for="(v, i) in myServeList"
          :key="i"
          @click="toPage(v.url, v.code)"
          :icon="v.icon"
          :text="v.text"
        />
      </van-grid>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'my',
  data () {
    return {
      userInfo: {
        storeName: null,
        storeRoleName: null
      },
      allAmount: 0,
      gift: 0,
      mybarList: [
        {
          url: '/orderList',
          text: '待付款',
          code: 0,
          icon: require('@/assets/images/my/obligation@2x.png')
        },
        {
          url: '/orderList',
          text: '待发货',
          code: 1,
          icon: require('@/assets/images/my/pending@2x.png')
        },
        {
          url: '/orderList',
          text: '待收货',
          code: 2,
          icon: require('@/assets/images/my/receiving@2x.png')
        },
        {
          url: '/orderList',
          text: '退换货',
          code: 6,
          icon: require('@/assets/images/my/returns@2x.png')
        }
      ],
      myServeList: [
        {
          url: '/purchase',
          text: '我要批',
          icon: require('@/assets/images/my/purchase@2x.png')
        },
        {
          url: '/assetsIndex',
          text: '收银台',
          icon: require('@/assets/images/my/checkstand@2x.png')
        },
        {
          url: '/buyGift',
          text: '购买礼券',
          icon: require('@/assets/images/my/buyGift@2x.png')
        },
        {
          url: '/giftConfig',
          text: '礼券配置',
          icon: require('@/assets/images/my/giftConfig@2x.png')
        }
      ],
      storeId: ''
    }
  },
  computed: {},
  watch: {},
  created () {
    this.storeId = this.$route.query.storeId || this.$lance.getData('storeId')
    this.$lance.setData('storeId', this.storeId)
    this.getStoreInfo()
    this.getMoneyInfo()
    this.getGiftInfo()
  },
  // activated () {
  //   this.userInfo = this.$lance.getJson('storeInfo')
  // },
  methods: {
    // 获取店铺信息
    getStoreInfo () {
      this.$http.post(
        this.$apiUri.APP_STORE_DETAIL_GET,
        { storeId: this.storeId },
        res => {
          this.userInfo = res.data
          this.$lance.setJson('storeInfo', res.data)
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取用户资产总数
    getMoneyInfo () {
      this.$http.post(
        this.$apiUri.APP_MONEY,
        {
          userId: this.storeId
        },
        res => {
          if (res.success) {
            this.allAmount = res.data.allAmount.toFixed(2).toString()
          }
        }
      )
    },
    // 获取用户礼券总数
    getGiftInfo () {
      this.$http.post(
        this.$apiUri.APP_TRANSACTIONTOTAL,
        {
          storeId: this.storeId
        },
        res => {
          if (res.success) {
            this.gift = res.data.freeAmount
          }
        }
      )
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    },
    /* 前往指定url页面 */
    toPage (url, query) {
      this.$router.push({
        path: url,
        query: {
          status: query
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.my {
  padding: 12px;
  .userInfo {
    width: 100%;
    height: 187px;
    background-image: url("~@/assets/images/my/my_bg.png");
    background-size: cover;
    background-repeat: inherit;
    padding: 24px 20px 12px;
    margin-bottom: 12px;
    .autor {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
    .name {
      max-width: 100px;
      vertical-align: top;
      display: inline-block;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
    .cutButtom {
      min-width: 42px;
      max-width: 108px;
      display: flex;
      align-items: center;
      height: 18px;
      font-size: 10px;
      background: #FFFFFF;
      border-radius: 35px;
      line-height: 18px;
      text-align: center;
      color: #EB6133;
      padding: 0 5px;
      .cut {
        width: 10px;
        height: 10px;
        margin-left: 6px;
      }
    }
    .setIcon {
      width: 20px;
      height: 20px;
      margin-top: 12px;
    }
    .bottom {
      width: 65px;
      text-align: center;
      .pcolor {
        color: #FFF2EE;
      }
    }
  }
  .stockOrder {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 14px;

    .van-cell__title {
      font-weight: 700;
      font-size: 14px;
    }
    .van-cell {
      padding: 0 0 10px;
    }
  }
  .serve {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 14px;
    margin-top: 12px;
  }
}
</style>
