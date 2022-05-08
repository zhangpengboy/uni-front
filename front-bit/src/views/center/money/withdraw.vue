<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : OTC 转出
-->

<template>
  <div class="center withdraw p-footer">
    <van-nav-bar
      title="转出"
      right-text="转出记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    />

    <!-- 提现方式 -->
    <div class="withdraw-way">
      <div
        class="main-wrap mb-2"
        v-if="_.size(cardList) > 0"
        style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)"
      >
        <van-cell clickable :border="false" size="large" @click="show = true">
          <template #title>
            <div class="d-flex align-items-center">
              <van-icon name="card" class="color-primary fs-24 mr-1" />
              <p>提现到银行卡</p>
              <van-icon name="arrow" class="fs-18" />
            </div>
          </template>
        </van-cell>
        <div class="main-wrap-cont pt-0">
          <p class="fs-14 mb-1">
            <span class="color-light">真实姓名：</span>
            <span class="ml-1">{{ card.cardName }}</span>
          </p>
          <p class="fs-14 mb-1">
            <span class="color-light">转账到银行卡：</span>
            <span class="ml-1"
              >{{ card.bankName }}({{ card.cardNo | filterCardNo }})</span
            >
          </p>
        </div>
      </div>
      <div class="no-bank" v-else @click="toCardList">
        <h4 class="fs-14 fw-b">添加您的提现方式</h4>
        <p
          class="fs-14 color-light mt-4 d-flex align-items-center justify-content-center"
        >
          <van-icon
            :name="require('@/assets/images/center/icon-add@2x.png')"
            size="14"
          />
          <span class="ml-1">提交本人的银行卡</span>
        </p>
      </div>
    </div>
    <!-- 导航  -->
    <van-tabs v-model="active" @click="handlerTabs">
      <van-tab title="CNY转出"></van-tab>
      <van-tab title="BTC代提"></van-tab>
      <van-tab title="ETH代提"></van-tab>
      <van-tab title="FIL代提"></van-tab>
      <van-tab title="XCH代提"></van-tab>
    </van-tabs>
    <!-- 提现数量 -->
    <div class="mt-2">
      <h2 class="fw-b fs-15 pl-3 py-2">提现数量</h2>
      <van-field
        v-model="digit"
        type="number"
        :placeholder="`可提现金额 ${ttmCny.freeAmount}`"
      >
        <template #button>
          <span class="color-main" @click="darwAllMoney">全部</span>
          <span class="color-light mx-2">|</span>
          <span>{{ bitType | filterBitType }}数量</span>
        </template>
      </van-field>
      <p class="color-main pl-3 fs-12 py-2">
        {{ bitType | filterBitType }}实时单价≈<span class="color-main">{{
          drawMin.cnyTrans
        }}</span
        >元
      </p>
    </div>
    <!-- 温馨提示 -->
    <div class="mt-2">
      <div class="color-light px-3 fs-12 py-2">
        <template v-if="active == 0">
          <p class="fs-12 mb-1">温馨提示</p>
          <p class="color-red fs-12 mb-1">
            1.最小提现金额为{{ drawMin.money }}{{ bitType | filterBitType }}起；
          </p>
        </template>
        <template v-else>
          <p class="fs-12 mb-1">温馨提示(OTC代提为第三方大宗商家承兑)</p>
          <p class="color-red fs-12 mb-1">
            1.最小提OTC代提数量为{{ drawMin.money
            }}{{ bitType | filterBitType }}；
          </p>
        </template>
        <p class="fs-12 mb-1">2.本次提现不收取手续费；</p>
        <p class="fs-12 mb-1">
          3.提现审核时间为工作日9:00-18:30，如超过2个工作日未到账请联系客服处理；
        </p>
        <p class="fs-12 mb-1">
          4.因三方支付风险限额，请广大用户在选择提现时，超过10000元以上，采用银行卡方式，避免因第三方支付原因，延迟到账或取消
        </p>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer-btn">
      <van-button block type="info" @click="showTrad=true" :disabled="digit <= 0">
        确定转出
      </van-button>
    </div>
    <!--交易密码 -->
    <van-popup
      v-model="showTrad"
      close-icon-position="top-left"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      position="bottom"
      @close='password = null'
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">请输入交易密码</h3>
          <van-field
            :type="showRePwd ? 'text' : 'password'"
            placeholder="请输入交易密码"
            v-model="password"
            autofocus
          >
          <template #right-icon>
              <van-icon
                size="22"
                name="eye-o"
                v-if="showRePwd"
                @click="showRePwd = false"
              />
              <van-icon
                size="22"
                name="closed-eye"
                v-else
                @click="showRePwd = true"
              />
            </template>
          </van-field>
          <router-link to="resetPayPasswords" class="forgetPaw pl-3"
            >忘记密码?</router-link
          >
        </div>
        <van-button
          class="flex-1"
          block
          type="info"
          size="small"
          round
          @click="submitWithdraw"
        >
          确定
        </van-button>
      </div>
    </van-popup>
    <!-- 添加收款方式 -->
    <van-popup v-model="show" closeable position="bottom">
      <h2 class="fw-b fs-15 pl-3 py-4">添加收款方式</h2>
      <van-radio-group v-model="drawWay">
        <van-cell-group>
          <van-cell
            clickable
            @click="(drawWay = i), (show = false)"
            size="large"
            v-for="(v, i) in cardList"
            :key="i"
          >
            <template #title>
              <div class="d-flex">
                <van-icon name="card" class="color-primary fs-24 mr-1" />
                <p>
                  银行卡<span class="fs-12"
                    >({{ v.cardName | filterCardName }})</span
                  >
                </p>
              </div>
            </template>
            <template #label>
              <span class="ml-6 fs-13"
                >{{ v.bankName }}({{ v.cardNo | filterCardNo }})</span
              >
            </template>
            <template #right-icon>
              <van-radio :name="i" />
            </template>
          </van-cell>
          <van-cell @click.stop="toCardList">
            <template #title>
              <div class="d-flex align-items-center">
                <van-icon name="plus" class="color-light fs-18 mr-1 fw-b" />
                <p class="color-light fs-14">添加收款方式</p>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>
<script>
// import Decimal from 'decimal.js-light'
export default {
  data () {
    return {
      assets: [],
      ttmCny: {},
      active: 0,
      bitType: 1,
      digit: null,
      drawWay: 0,
      cardList: [],
      card: {},
      show: false,
      drawMin: {},
      showTrad: false,
      showRePwd: false,
      password: null
    }
  },
  watch: {
    active () {
      this.digit = null
    },
    drawWay (nVal) {
      this.card = this.cardList[nVal]
    }
  },
  activated () {
    this.getBitCardList()
  },
  mounted () {
    this.getUserMoney()
    this.getWithdrawMin(this.bitType)
  },
  methods: {
    /** 获取资产 */
    getUserMoney () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.assets = res.data
        this.ttmCny = _.find(this.assets, (v) => v.bitType === this.bitType)
      })
    },
    /** 获取用户绑定的银行卡列表 */
    getBitCardList () {
      this.$http.post(this.$apiUri.APP_BIT_CARD_LIST, null, (res) => {
        this.cardList = res.data
        if (_.size(res.data) > 0) this.card = res.data[this.drawWay]
      })
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    /** 交易记录 */
    onClickRight () {
      this.$router.push('withdrawList')
    },
    /** 银行卡列表 */
    toCardList () {
      this.show = false
      this.$router.push('cardList')
    },
    /** 确定转出 */
    submitWithdraw () {
      if (this.password == null || this.password === '') {
        return this.$toast('请输入交易密码')
      }
      this.$http.post(
        this.$apiUri.APP_WITHDRAW_ORDER_ADD,
        {
          money: this.digit,
          cardNo: this.card.cardNo,
          bitPrice: 1, // TODO 获取得到
          bitType: this.bitType, // 币的类型
          password: this.$md5(this.password) // 交易密码
        },
        (res) => {
          this.$router.push({
            name: 'withdrawStatus',
            query: { orderNo: res.data, showBtn: true }
          })
        },
        (err) => {
          this.showTrad = false
          this.password = null
          this.$toast(err.message)
        }
      )
    },
    /** 全部操作 */
    darwAllMoney () {
      this.digit = this.ttmCny.freeAmount || null
    },
    /** tbas 点击切换 */
    handlerTabs () {
      this.bitType = this.active + 1
      this.getUserMoney()
      this.getWithdrawMin(this.bitType)
    },
    /** 获取当前类型最小提现 */
    getWithdrawMin (bitType) {
      this.$http.post(this.$apiUri.APP_WITHDRAW_MIN, { bitType }, (res) => {
        this.drawMin = res.data
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.bitType = +to.query.bitType || 1
      vm.active = vm.bitType - 1
    })
  }
}
</script>
