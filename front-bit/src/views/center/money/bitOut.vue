<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-16 17:24:14
 * @Description : Bit 转出
-->
<template>
  <div class="center bit">
    <div class="bit-box">
      <van-image
        :src="bitType | filterBitImg"
        round
        width="64"
        height="64"
        class="image"
      />
      <h2 class="fs-15 mb-2 text-center">转出{{ bitType | filterBitType }}</h2>
      <p class="fs-13 color-light text-center mb-5" @click="show = true">
        切换<span class="ml-1">></span>
      </p>

      <div class="bit-form">
        <p class="bg-white px-3 py-2 d-flex justify-content-between">
          <span class="fw-b">转出数量</span>
          <span class="fs-12 color-light"
            >矿工费: {{ feiObj.fei }} {{ bitType | filterBitType }}</span
          >
        </p>
        <div class="mx-2 mb-5">
          <van-field
            v-model="params.number"
            :placeholder="`可提现金额${bit.freeAmount}${filterBitType()}`"
            size="large"
            type="number"
            :rules="[{ required: true, message: '请输入提现金额' }]"
            class="bg-light radius-5"
          />
        </div>
        <p class="bg-white px-3 py-2">
          <span class="fw-b">转账地址</span>
        </p>
        <div class="mx-2 mb-3">
          <van-field
            v-model="params.walletAddress"
            placeholder="输入转账地址"
            size="large"
            :rules="[{ required: true, message: '请输入转账地址' }]"
            class="bg-light radius-5"
            right-icon="scan"
          />
          <p class="color-light fs-12 p-2">
            转出前请务必确认地址及币种信息无误，已经转出，不可撤销！
          </p>
        </div>
      </div>
      <!-- 提示 -->
      <div class="pl-3 color-light">
        <p class="fs-13">提示：</p>
        <p class="fs-13">1.最小输出数量为0.0005BTC</p>
        <p class="fs-13">
          2.请务必保证提币钱包地址的准确性，否则资产将无法找回；
        </p>
        <p class="fs-13">3.矿工费具体多少由市场决定，平台不收取手续费；</p>
        <p class="fs-13">
          4.提币审核会在24小时内完成，具体到账时间会受到网络影响，可能会有所延迟；
        </p>
        <p class="fs-13">5.如长时间未到账，请及时联系客服。</p>
      </div>

      <!-- 按钮 -->
      <div class="bit-btn" @click="onSubmit">
        <span>确定转出</span>
      </div>
    </div>
    <!-- 切换类型 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="handlerSelect"
    />

    <!--短信验证码 -->
    <van-popup
      v-model="showTrad"
      close-icon-position="top-left"
      closeable
      round
      safe-area-inset-bottom
      close-on-popstate
      :close-on-click-overlay="false"
      position="bottom"
    >
      <div class="px-2 pt-8 pb-5 d-flex align-items-center">
        <div class="w-70">
          <h3 class="fw-b mt-3 mb-2 ml-2">请输入短信验证码</h3>
          <van-field
            type="digit"
            placeholder="请输入短信验证码"
            v-model="msgCode"
            autofocus
          >
            <template #right-icon>
              <span @click="onSendMsg" class="color-main">
                {{ textMsg }}
              </span>
            </template>
          </van-field>
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      assets: [],
      bit: {}, // 当前bit账号
      bitType: null,
      feiList: [], // 提现手续费列表
      feiObj: {}, // 当前提现币类型手续费对象
      params: {
        number: null,
        walletAddress: null
      },
      show: false,
      actions: [
        { name: 'BTC', bitType: 2 },
        { name: 'ETH', bitType: 3 }
      ],
      walletList: [],
      msgCode: null,
      signNo: null,
      timer: null,
      second: 90,
      textMsg: '发送验证码',
      showTrad: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    this.getUserMoney()
    this.getWalletList()
    this.getWithdrawFeiList()
  },
  methods: {
    filterBitType () {
      return ['CNY', 'BTC', 'ETH'][this.bitType - 1]
    },
    /** 选择切换 */
    handlerSelect (v) {
      this.bitType = v.bitType
      this.bit = _.find(this.assets, (v) => v.bitType === this.bitType)
      this.params.walletAddress = _.find(
        this.walletList,
        (v) => v.bitType === this.bitType
      ).walletAddress
    },
    /** 获取资金列表 */
    getUserMoney () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.assets = res.data
        this.bit = _.find(res.data, (v) => v.bitType === this.bitType)
      })
    },
    /** 获取钱包列表 */
    getWalletList () {
      this.$http.post(this.$apiUri.APP_CARD_WALLET_GET, null, (res) => {
        this.walletList = res.data
        this.params.walletAddress = _.find(
          res.data,
          (v) => v.bitType === this.bitType
        ).walletAddress
      })
    },
    /** 获取手续费列表 */
    getWithdrawFeiList () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET_FEI, null, (res) => {
        this.feiList = res.data
        this.feiObj = _.find(res.data, (v) => v.bitType === this.bitType)
      })
    },
    /** 立即购买 提交订单 */
    onSubmit () {
      if (this.params.number === '') return this.$toast('请输入提现数量')
      if (this.params.walletAddress === '') { return this.$toast('请填写转出地址') }
      this.showTrad = true
    },
    /** 确定转出 */
    submitWithdraw () {
      if (this.signNo === null) { return this.$toast('请先发送验证码') }
      if (this.msgCode === '') { return this.$toast('请填写验证码') }
      this.$http.post(
        this.$apiUri.APP_WITHDRAW_ORDER_ADD,
        {
          money: this.params.number,
          walletAddress: this.params.walletAddress,
          // bitPrice: this.params.number,
          bitType: this.bitType, // 币的类型
          code: this.msgCode,
          signNo: this.signNo
        },
        (res) => {
          this.showTrad = false
          this.$router.push({
            name: 'bitOutStatus',
            query: { orderNo: res.data }
          })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    /** 发送短信 */
    onSendMsg () {
      this.$http.post(this.$apiUri.APP_WITHDRAW_SMS_SIGN, null, (res) => {
        this.signNo = res.data
        this.$http.post(
          this.$apiUri.APP_COMMON_SEND_MSG,
          {
            mobile: this.user.phone,
            signNo: this.signNo
          },
          () => {
            this.$toast('发送成功,请注意查收!')
            this.timer = setInterval(() => {
              this.second--
              this.textMsg = `已发送 ${this.second} s`
              if (this.second <= 0) {
                this.second = 90
                clearInterval(this.timer)
                this.textMsg = '重新发送验证码'
              }
            }, 1000)
          }
        )
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.bitType = +to.query.bitType
    })
  }
}
</script>
