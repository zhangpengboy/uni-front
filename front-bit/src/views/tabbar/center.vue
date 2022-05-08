<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 个人中心
-->
<template>
  <div class="center">
    <div class="center-info">
      <!-- 商户信息 -->
      <div class="d-flex p-4">
        <van-image
          round
          :src="require('@/assets/images/center/head@2x.png')"
          class="headimg"
        />
        <div class="headinfo" v-if="user && hasLogin">
          <div class="nickname">{{ user.userName }}</div>
          <div class="mobile">{{ user.phone }}</div>
        </div>
        <div class="headinfo" v-else>
          <div class="headlogin" @click="toPage('login')">注册/登录</div>
        </div>
        <div class="settings" @click="toPage('settings')">
          <van-icon name="setting-o" size="24" class="color-light" />
        </div>
      </div>
      <!-- 商户资产 -->
      <van-grid :column-num="3" icon-size="22" :gutter="20" class="mb-4">
        <van-grid-item
          :icon="require('@/assets/images/center/icon-order@2x.png')"
          text="我的订单"
          to="orderList"
        />
        <van-grid-item
          :icon="require('@/assets/images/center/icon-bank@2x.png')"
          text="货币钱包"
          to="wallet"
        />
        <van-grid-item
          :icon="require('@/assets/images/center/icon-invite@2x.png')"
          text="邀请好友"
          @click="jumpInvitePage"
        />
      </van-grid>

      <!-- 余额 -->
      <div class="balance" @click="toPage('moneyInfo', 1)">
        <div class="d-flex align-items-center">
          <span class="mr-1">CNY余额</span>
          <template v-if="showMoney">
            <van-icon name="eye-o" @click.stop="onShowMoney(0)" />
          </template>
          <template v-else>
            <van-icon name="closed-eye" @click.stop="onShowMoney(1)" />
          </template>
        </div>
        <div class="d-flex align-items-center">
          <template v-if="showMoney">
            <span class="num">{{ cny.allAmount }}</span>
          </template>
          <template v-else>
            <span class="num">······</span>
          </template>
          <van-icon
            :name="require('@/assets/images/center/icon-right@2x.png')"
            size="12"
          />
        </div>
      </div>
    </div>

    <!-- 资产 -->
    <div class="center-assets">
      <div class="money money-top">
        <div class="item" @click="toPage('moneyInfo', 2)">
          <h3>BTC余额</h3>
          <h1 v-if="showMoney">{{ btc.allAmount }}</h1>
          <h1 v-else>····</h1>
        </div>
        <div class="item pl-4" @click="toPage('moneyInfo', 3)">
          <h3>ETH余额</h3>
          <h1 v-if="showMoney">{{ eth.allAmount }}</h1>
          <h1 v-else>····</h1>
        </div>
      </div>
      <div class="money money-bottom">
        <div class="item" @click="toPage('moneyInfo', 4)">
          <h3>FIL余额</h3>
          <h1 v-if="showMoney">{{ fil.allAmount }}</h1>
          <h1 v-else>····</h1>
        </div>
        <div class="item pl-4" @click="toPage('moneyInfo', 5)">
          <h3>XCH余额</h3>
          <h1 v-if="showMoney">{{ xch.allAmount }}</h1>
          <h1 v-else>····</h1>
        </div>
      </div>

      <!-- <div class="main-wrap d-flex justify-content-between align-items-center">
        <p class="fs-14 color-light">
          <span>资产预估（CNY）</span>
          <span>≈{{ cny.allAmount }}</span>
        </p>
        <p class="fs-13 color-light">
          <span @click="toPage('withdraw')">转出</span>
          <span class="px-2">|</span>
          <span class="color-main" @click="toPage('recharge')">转入</span>
        </p>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      cny: {},
      btc: {},
      eth: {},
      fil: {},
      xch: {},
      showMoney: true,
      inviteCode: '',
      hasLogin: false
    }
  },
  computed: {
    ...mapState(['user'])
  },

  activated () {
    this.showMoney = !!+this.$lance.getData('show-money')
    if (!this.$store.state.hasLogin) {
      this.cny = {}
      this.btc = {}
      this.eth = {}
      this.fil = {}
      this.xch = {}
    }
    this.getUserInfo()
  },
  methods: {
    /** 获取登录信息 */
    getUserInfo () {
      this.$http.post(this.$apiUri.APP_USER_INFO, null, (res) => {
        this.$store.dispatch('login', res.data)
        this.hasLogin = this.$store.state.hasLogin
        this.getMallUserDetail()
        if (this.$store.state.hasLogin) {
          this.getUserBit()
        }
      })
    },
    /** 获取邀请码等信息 */
    getMallUserDetail () {
      this.$http.post(this.$apiUri.APP_USER_INVITE_CODE, {}, (res) => {
        this.inviteCode = res.data.code
      })
    },
    /** 获取bit资产 */
    getUserBit () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.cny = _.find(res.data, (v) => v.bitType === 1) // CNY
        this.btc = _.find(res.data, (v) => v.bitType === 2) // BTC
        this.eth = _.find(res.data, (v) => v.bitType === 3) // ETH
        this.fil = _.find(res.data, (v) => v.bitType === 4) // ETH
        this.xch = _.find(res.data, (v) => v.bitType === 5) // ETH
      })
    },
    /** 跳转资产详情 */
    toPage (page, bitType) {
      this.$router.push({
        name: page,
        query: {
          bitType
        }
      })
    },
    /** 显示隐藏金额 */
    onShowMoney (bl) {
      this.$lance.setData('show-money', bl)
      this.showMoney = !!bl
    },
    /** 跳转邀请好友页面 */
    jumpInvitePage () {
      // console.log(this.$store.state.hasLogin)
      if (!this.$store.state.hasLogin) {
        return this.$router.push('login')
      }
      window.location.href = `/invited.html?inviteCode=${
        this.inviteCode
      }&nickName=${escape(this.user.userName)}&headImg=`
    }
  }
}
</script>
