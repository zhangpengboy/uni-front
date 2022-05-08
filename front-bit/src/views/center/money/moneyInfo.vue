<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 资产详情
-->

<template>
  <div class="center center-money p-footer">
    <van-nav-bar
      title="资产详情"
      right-text="交易记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      :border="false"
      placeholder
    />
    <div class="money-info">
      <p class="fs-14 mb-2 d-flex align-items-center">
        <span>资产预估（CNY）</span>
        <template v-if="showMoney">
          <van-icon name="eye-o" size="15" @click.stop="onShowMoney(0)" />
        </template>
        <template v-else>
          <van-icon name="closed-eye" size="15" @click.stop="onShowMoney(1)" />
        </template>
      </p>
      <h1 class="fs-30 mb-4" v-if="showMoney">≈{{ ttmCny }}</h1>
      <h1 class="fs-30 mb-4" v-else>·····</h1>
      <div class="tips">
        <van-icon
          :name="require('@/assets/images/center/icon-dun@2x.png')"
          size="12"
        />
        <p class="fs-13 ml-1">资产保护中</p>
      </div>
    </div>
    <van-tabs
      v-model="active"
      background="#1E74E4"
      color="white"
      title-active-color="white"
      title-inactive-color="#A3CAFE"
      @click="handlerTabs"
    >
      <van-tab title="CNY资产"> </van-tab>
      <van-tab title="BTC资产"> </van-tab>
      <van-tab title="ETH资产"> </van-tab>
      <van-tab title="FIL资产"> </van-tab>
      <van-tab title="XCH资产"> </van-tab>
    </van-tabs>

    <!-- 资产 -->
    <div class="main-wrap money-assets mt-2" :class="bitClass[bitType - 1]">
      <div class="main-wrap-cont text-center">
        <p class="mb-2 fs-13 pt-5">{{ bitType | filterBitType }}总资产</p>
        <h1 class="fs-30" v-if="showMoney">{{ bitAssets.freeAmount }}</h1>
        <h1 class="fs-30" v-else>····</h1>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer-btn">
      <van-button block plain class="mr-2" type="info" @click="toWithdraw">
        转出
      </van-button>
      <van-button
        block
        class="ml-2"
        type="info"
        @click="toRecharge"
        v-show="active == 0"
      >
        转入
      </van-button>
    </div>
  </div>
</template>
<script>
import { Decimal } from 'decimal.js-light'
export default {
  data () {
    return {
      bitClass: ['cny', 'btc', 'eth', 'fil', 'xch'],
      active: 0,
      bitType: 1,
      showMoney: true,
      assets: [],
      ttmCny: 0, // 当前资产预估
      bitAssets: {}
    }
  },
  created () {
    // console.log(typeof this.$route.query.bitType) //string
    this.bitType = this.$route.query.bitType * 1 // 需要转成number
    this.active = this.bitType - 1
    this.showMoney = !!+this.$lance.getData('show-money')
    this.getUserMoney()
  },
  methods: {
    /** 获取资金详情 */
    getUserMoney () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.assets = res.data
        this.bitAssets = _.find(this.assets, (v) => v.bitType === this.bitType)
        this.getWithdrawMin(this.bitType)
      })
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    /** 交易记录 */
    onClickRight () {
      this.$router.push('moneyList')
    },
    /** 转出 */
    toWithdraw () {
      this.$router.push({
        name: 'withdraw',
        query: { bitType: this.bitType }
      })
    },
    /** 出入 */
    toRecharge () {
      this.$router.push('recharge')
    },
    /** 显示隐藏 */
    onShowMoney (bl) {
      this.$lance.setData('show-money', bl)
      this.showMoney = !!bl
    },
    /** tbas 点击切换 */
    handlerTabs () {
      this.bitType = this.active + 1
      this.bitAssets = _.find(this.assets, (v) => v.bitType === this.bitType)
      this.getWithdrawMin(this.bitType)
    },
    /** 获取当前类型最小提现 */
    getWithdrawMin (bitType) {
      this.$http.post(this.$apiUri.APP_WITHDRAW_MIN, { bitType }, (res) => {
        if (res.success) {
          this.ttmCny = Decimal(res.data.cnyTrans)
            .mul(this.bitAssets.freeAmount)
            .toFixed(2)
        }
      })
    }
  }
  // ,
  // beforeRouteEnter (to, from, next) {
  //   next((vm) => {
  //     vm.bitType = +to.query.bitType || 1
  //     console.log("进去页面之前beforeRouteEnter：" + vm.bitType)
  //     vm.active = vm.bitType - 1
  //   })
  // }
}
</script>
