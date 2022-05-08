<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-08 18:17:35
 * @Description : 绑定BTC地址
-->
<template>
  <div class="center cards pt-2">
    <van-form @submit="onSubmit">
      <p class="bg-white px-3 py-2">
        {{ bitType | filterBitType }}地址<span class="color-red">*</span>
      </p>
      <van-field
        v-model="params.walletAddress"
        :placeholder="`请输入BTC钱包地址`"
        size="large"
        :rules="[{ required: true, message: '请填写BTC钱包地址' }]"
        v-if="bitType == 2"
      />
      <van-field
        v-model="params.walletAddress"
        :placeholder="`请输入ETH钱包地址`"
        size="large"
        :rules="[{ required: true, message: '请填写ETH钱包地址' }]"
        v-else-if="bitType == 3"
      />

      <div
        v-qr="options"
        v-if="options.text"
        class="bg-white p-2 text-center"
      ></div>

      <!-- <van-field
        v-model="params.code"
        input-align="right"
        type="number"
        label="短信验证"
        required
        placeholder="请填写"
        size="large"
        :rules="[{ required: true, message: '请填写短信验证' }]"
      >
        <template #button>
          <span class="color-main" @click="onSendMsg">{{ textMsg }}</span>
        </template>
      </van-field> -->

      <div class="p-3">
        <p class="color-light fs-13 mb-2">温馨提示</p>
        <p class="color-light fs-12">1.带*号的选项为必填项;</p>
        <p class="color-light fs-12">
          2.用户信息仅限于绑定、平台保障用户信息安全；
        </p>
      </div>
      <div class="px-3 py-5">
        <van-button block type="info" native-type="submit">
          {{ isEdit ? "修改绑定" : "提交" }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      isEdit: false,
      params: {
        walletAddress: '',
        walletImg: '',
        phone: '',
        code: '',
        signNo: ''
      },
      timer: null,
      second: 90,
      textMsg: '发送验证码',
      msgFlag: false,
      bitType: null,
      options: {
        text: '',
        width: 128,
        height: 128
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    this.getWalletList()
  },
  methods: {
    /** 获取钱包列表 */
    getWalletList () {
      this.$http.post(this.$apiUri.APP_CARD_WALLET_GET, null, (res) => {
        this.params = _.assign(
          this.params,
          _.find(res.data, (v) => v.bitType === +this.bitType)
        )
        this.options.text = this.params.walletAddress
        if (this.params.id) {
          this.isEdit = true
        }
      })
    },
    /** 发送短信 */
    onSendMsg () {
      if (this.msgFlag) return
      this.$http.post(this.$apiUri.APP_CARD_SMS_SIGN, null, (res) => {
        this.params.signNo = res.data
        this.params.phone = this.user.phone
        this.$http.post(
          this.$apiUri.APP_COMMON_SEND_MSG,
          {
            mobile: this.user.phone,
            signNo: this.params.signNo
          },
          () => {
            this.msgFlag = true
            this.$toast('发送成功!')
            this.timer = setInterval(() => {
              this.second--
              this.textMsg = `已发送 ${this.second} s`
              if (this.second <= 0) {
                this.msgFlag = false
                this.second = 90
                clearInterval(this.timer)
                this.textMsg = '重新发送'
              }
            }, 1000)
          }
        )
      })
    },
    /** 提交表单 */
    onSubmit () {
      if (this.isEdit) {
        delete this.params.createTime
        delete this.params.userId
      }
      this.params.bitType = this.bitType
      this.$http.post(this.$apiUri.APP_CARD_WALLET_ADD, this.params, () => {
        this.$toast('添加成功')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.title = '绑定' + ['BTC', 'ETH'][+to.query.bitType - 2] + '地址'
    next((vm) => {
      vm.bitType = to.query.bitType || null
    })
  }
}
</script>
