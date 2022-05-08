<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-08 18:17:35
 * @Description : 绑定银行卡
-->
<template>
  <div class="center cards pt-2">
    <van-form @submit="onSubmit">
      <van-field
        v-model="params.cardName"
        input-align="right"
        label="真实姓名"
        required
        placeholder="请输入真实姓名"
        size="large"
        :rules="[{ required: true, message: '请填写真实姓名' }]"
      />
      <van-field
        v-model="params.cardNo"
        input-align="right"
        type="number"
        label="银行卡号"
        required
        placeholder="请输入银行卡号"
        size="large"
        :rules="[{ required: true, message: '请填写银行卡号' }]"
      />
      <van-field
        v-model="params.bankName"
        input-align="right"
        label="开户银行"
        required
        placeholder="请输入开户银行"
        size="large"
        :rules="[{ required: true, message: '请填写开户银行' }]"
      />

      <van-field
        v-model="params.bankAddress"
        input-align="right"
        label="开户支行"
        required
        placeholder="请输入开户支行"
        size="large"
        :rules="[{ required: true, message: '请填写开户支行' }]"
      />
      <van-field
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
      </van-field>

      <div class="p-3">
        <p class="color-light fs-13 mb-2">温馨提示</p>
        <p class="color-light fs-12">1.带*号的选项为必填项;</p>
        <p class="color-light fs-12">
          2.用户信息仅限于绑定、平台保障用户信息安全；
        </p>
      </div>
      <div class="px-3 py-5">
        <van-button block type="info" native-type="submit">提交</van-button>
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
        cardName: '',
        cardNo: '',
        bankName: '',
        bankAddress: '',
        phone: '',
        code: '',
        signNo: ''
      },
      timer: null,
      second: 90,
      textMsg: '发送验证码',
      msgFlag: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {},
  methods: {
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
      this.$http.post(this.$apiUri.APP_BIT_CARD_ADD, this.params, () => {
        this.$toast('添加成功')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      })
    }
  }
}
</script>
