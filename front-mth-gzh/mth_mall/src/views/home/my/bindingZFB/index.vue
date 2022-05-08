<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 14:38:27
 * @Description : 绑定支付宝
-->

<template>
  <div>
    <div class="iocnfont">
      <img style="margin-left: 88px" src="@/assets/images/logo.png" alt="" />
      <img src="@/assets/images/rigin.png" alt="" />
      <img src="@/assets/images/paypal.png" alt="" />
    </div>
    <div>
      <van-form>
        <van-field
          v-model="accountin"
          placeholder="输入支付宝账号"
          label="到账支付宝"
          size="large"
          class="py-3"
        />
        <van-field
          v-model="namein"
          placeholder="输入与支付宝对应的姓名"
          label="真实姓名"
          size="large"
          class="py-3"
        />
        <van-field
          maxlength="11"
          v-model="phonein"
          placeholder="输入手机号"
          type="number"
          label="手机号码"
          size="large"
          class="py-3"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="yzmin"
          size="large"
          class="py-3"
        >
          <template #button>
            <div class="yz-span">
              <button class="sendSmsBtn" @click="sendSms" :disabled="disabled">
                {{ text == null ? yzmdjs + '秒重新获取' : text }}
              </button>
            </div>
          </template>
        </van-field>
        <div style="margin: 50px 16px">
          <van-button round block type="warning" @click="bindingAli"
            >立即绑定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      accountin: '',
      disabled: false,
      intervalBtn: null,
      namein: '',
      phonein: '',
      yzmin: '',
      storeAccountId: '', // 账户ID
      text: '获取验证码',
      yzmdjs: '60'
    }
  },
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  created () {
    // this.phonein = this.userInfo.phone
  },
  methods: {
    // 发送验证码
    sendSms () {
      // if (!this.phonein) return this.$toast('请输入手机号')
      if (!this.phonein) {
        return this.$toast('手机号不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.phonein
        )
      ) {
        return this.$toast('手机号不正确')
      }
      this.text = null
      this.disabled = true
      this.intervalBtn = setInterval(() => {
        if (this.yzmdjs <= 0) {
          clearInterval(this.intervalBtn)
          this.text = '获取验证码'
          this.disabled = false
          this.yzmdjs = 60
        }
        this.yzmdjs--
      }, 1000)
      this.$http.post(
        this.$apiUri.APP_ADD_BINk_ALIPAY,
        {
          mobile: this.phonein
        },
        res => {
          if (res.success) {
            this.signNo = res.data
            this.$http.post(
              this.$apiUri.APP_ADD_BINk_DSES,
              {
                mobile: this.phonein,
                signNo: res.data
              },
              res => {
                this.$toast('短信发送成功')
              },
              () => {
                this.$toast('短信发送失败')
              }
            )
          }
        }
      )
    },
    // 提交绑定
    bindingAli () {
      if (!this.accountin) return this.$toast('请输入支付宝账号')
      if (!this.namein) return this.$toast('请输入与手机号对应的姓名')
      // if (!this.phonein) return this.$toast('请输入手机号')
      if (!this.phonein) {
        return this.$toast('手机号不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.phonein
        )
      ) {
        return this.$toast('手机号不正确')
      }
      if (!this.yzmin) return this.$toast('请输入验证码')
      this.$http.post(
        this.$apiUri.APP_ADD_BIND_ALIPAY,
        {
          account: this.accountin,
          userId: this.userWeixinInfo.id,
          code: this.yzmin,
          phone: this.phonein,
          signNo: this.signNo,
          userName: this.namein,
          userType: 0
        },
        res => {
          this.$toast('绑定成功')
          this.$router.push('wallet')
          // this.$router.back()
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.iocnfont {
  height: 105px;
  background-color: #fff;
  margin-bottom: 12px;
  img {
    width: 48px;
    margin-left: 32px;
    height: 48px;
    margin-top: 32px;
  }
}
.sendSmsBtn {
  width: 85px;
  height: 28px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 41px;
  font-size: 13px;
  color: #fff;
}
</style>
