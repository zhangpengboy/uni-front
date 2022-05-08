<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 用户绑定手机号
-->
<template>
  <div>
    <div class="imgs">
      <img src="@/assets/images/logo.png" alt="" />
    </div>
    <p class="text">引客、留客、锁客专家</p>
    <div class="form" ref="form">
      <van-form>
        <van-field
          v-model="form.phone"
          maxlength="11"
          type="tel"
          name="手机号"
          label="手机号"
          clearable
          placeholder="请输入手机号"
        />
        <van-field
          v-model="form.sms"
          clearable
          type="number"
          label=""
          placeholder="请输入短信验证码"
        >
          <template #label>
            <div class="sms">短信验证码</div>
          </template>
          <template #button>
            <van-button
              size="small"
              color="#eb6133"
              @click="smsSend"
              :disabled="disabled"
            >
              <span>{{
                text === null ? countDown + '秒后重新获取' : text
              }}</span></van-button
            >
          </template>
        </van-field>
        <div style="margin: 20px 16px">
          <van-button
            style="background: #eb6133; border: 1px solid #eb6133"
            round
            block
            type="info"
            @click="submitForm"
            >立即绑定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        phone: null,
        sms: null
      },
      signNo: null, // 短信签约号
      countDown: 60,
      disabled: false,
      intervalBtn: null,
      text: '获取验证码',
      regPhone: /^1([3456789][0-9])\d{8}$/ // 手机号码验证
    }
  },
  methods: {
    // 发送短信
    smsSend () {
      // 短信签约signNo
      if (!this.form.phone) {
        return this.$toast('请输入手机号')
      }
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号填写错误')
      }
      this.text = null
      this.disabled = true
      this.intervalBtn = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(this.intervalBtn)
          this.disabled = false
          this.text = '获取验证码'
          this.countDown = 60
        }
        this.countDown--
      }, 1000)
      this.$http.post(
        this.$apiUri.APP_REGISTSMSSIGN,
        { mobile: this.form.phone },

        res => {
          console.log(res)
          this.signNo = res.data
          this.getSmsSend(res.data)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 短信发送
    getSmsSend (signNo) {
      this.$http.post(
        this.$apiUri.APP_REGISTSMS_SEND,
        {
          mobile: this.form.phone,
          signNo: signNo
        },

        res => {
          this.$toast('短信发送成功')
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // * 提交表单
    submitForm () {
      if (!this.form.phone) {
        return this.$toast('请输入手机号')
      }
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号填写错误')
      }
      if (!this.form.sms) {
        return this.$toast('请输入短信验证码')
      }
      console.log(this.$route.query.data)

      const query = this.$route.query.data
      query.nickName = this.$route.query.data.nickname
      query.gzhOpenId = this.$route.query.data.openid
      delete query.nickname
      delete query.openid
      const params = _.assign(
        {
          signCode: this.form.sms,
          mobile: this.form.phone,
          signNo: this.signNo,
          inviteCode: window.sessionStorage.getItem('inviteCode')
        },
        query
      )

      this.$http.post(
        this.$apiUri.APP_BINDINGPHONE,
        params,
        res => {
          console.log(22, res.data)
          this.$toast('绑定成功')
          this.$store.dispatch('setUserWeixinInfo', res.data.userWechatInfo)
          this.$store.dispatch('login', {
            token: res.data.token
          })
          this.$store.dispatch('setUserInfo', res.data.userInfo)
          this.$baseUtils.goBeforeLoginUrl()
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
.imgs {
  width: 100%;
  width: 66px;
  height: 58px;
  opacity: 1;
  margin-left: 40%;
  padding-top: 20px;
}
.sms {
  margin-top: 5px;
}
.text {
  text-align: center;
  margin: 48px 0;
  color: #eb6133;
  font-weight: 700;
  font-size: 14px;
}
// .form {
//   // margin-top: 38px;
// }
</style>
