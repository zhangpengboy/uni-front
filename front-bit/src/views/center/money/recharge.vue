<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 充值
-->

<template>
  <div class="center recharge p-footer">
    <van-nav-bar
      title="充值"
      right-text="充值记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    />

    <van-tabs v-model="active">
      <van-tab title="CNY转入">
        <div class="main-wrap bg-main mt-2">
          <div class="main-wrap-cont text-center">
            <p class="mb-2 fs-13">账户余额（CNY）</p>
            <h1 class="fs-30">{{ money.allAmount }}</h1>
          </div>
        </div>
      </van-tab>
      <van-tab disabled></van-tab>
      <van-tab disabled></van-tab>
      <van-tab disabled></van-tab>
    </van-tabs>

    <!-- 购买数量 -->
    <div class="mt-2">
      <h2 class="fw-b fs-15 pl-3 py-2">购买数量</h2>
      <van-field
        v-model="digit"
        type="digit"
        placeholder="请输入您的转入金额,限整数"
      >
        <template #button>
          <span>CNY数量</span>
        </template>
      </van-field>
      <p class="color-main pl-3 fs-12 py-2">CNY实时单价≈1元/CNY</p>
    </div>

    <!-- 支付方式 -->
    <div class="mt-2">
      <h2 class="fw-b fs-15 pl-3 py-2">支付方式</h2>
      <van-radio-group v-model="payway">
        <van-cell-group>
          <van-cell clickable @click="payway = 1" size="large">
            <template #title>
              <div class="d-flex">
                <van-icon name="card" class="color-primary fs-24 mr-1" />
                <p>银行卡转账<span class="color-light">(安全可靠不限额)</span></p>
              </div>
            </template>
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="color-light px-3 fs-12 py-2">
        <p class="fs-12 mb-1">温馨提示：</p>
        <p class="color-red fs-12 mb-1">
          1、请在转账时备注账户手机号码（请勿备注含矿机、数字货币、比特币、以太坊或者英文BTC、ETH等字眼），如有铭感字眼的备注将不做充值处理，七天后所转账金额按原路返回；
        </p>
        <p class="fs-12 mb-1">
          2、如有任何疑问请联系官方客服（请在工作日9:00~18:00之间完成充值）；
        </p>
        <p class="fs-12 mb-1">
          3、仅支持储蓄卡充值。
        </p>
      </div>
    </div>

    <!-- 底部 -->
    <div class="footer-btn">
      <van-button block type="info" @click="submitRecharge" :disabled="!digit">
        立即充值
      </van-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      money: {},
      active: 0,
      digit: null,
      payway: 1
    }
  },
  mounted () {
    this.getUserMoney()
  },
  methods: {
    /** 获取订单详情 */
    getUserMoney () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.money = _.find(res.data, (v) => v.bitType === 1)
      })
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    /** 交易记录 */
    onClickRight () {
      this.$router.push('rechargeList')
    },
    /** 转出 */
    toWithdraw () {
      this.$router.push('withdraw')
    },
    /** 立即充值 */
    submitRecharge () {
      this.$http.post(this.$apiUri.APP_RECHARGE_ORDER_ADD, {
        money: this.digit,
        bitPrice: 1,
        bitType: 1 // 币的类型
      }, res => {
        this.$router.push({ name: 'rechargeOrder', query: { orderNo: res.data } })
      })
    }
  }
}
</script>
