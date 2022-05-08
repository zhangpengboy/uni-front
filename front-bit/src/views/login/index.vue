<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 商户登录
-->
<template>
  <div class="container">
    <div class="welcome">
      <div>你好,</div>
      <div>欢迎使用！</div>
    </div>
    <div class="logintype">
      <div class="form">
        <!-- 手机号 + 密码 -->
        <template v-if="showPwdLogin">
          <div class="form-item van-hairline--bottom">
            <div class="form-item-label"><span>手机号</span></div>
            <van-field
              type="tel"
              placeholder="请输入您的手机号"
              v-model="form.phone"
              maxlength="11"
            />
          </div>
          <div class="form-item van-hairline--bottom">
            <div class="form-item-label"><span>密码</span></div>
            <van-field
              :type="showPwd ? 'text' : 'password'"
              placeholder="请输入您的密码"
              v-model="form.password"
            >
              <template #right-icon>
                <van-icon
                  size="22"
                  name="eye-o"
                  v-if="showPwd"
                  @click="showPwd = false"
                />
                <van-icon
                  size="22"
                  name="closed-eye"
                  v-else
                  @click="showPwd = true"
                />
              </template>
            </van-field>
          </div>
        </template>
        <!-- 手机号 + 验证码 -->
        <template v-else>
          <div class="form-item van-hairline--bottom">
            <div class="form-item-label"><span>手机号</span></div>
            <van-field
              type="tel"
              placeholder="请输入您的手机号"
              v-model="form.phone"
            />
          </div>
          <div class="form-item van-hairline--bottom">
            <div class="form-item-label"><span>验证码</span></div>
            <van-field
              type="number"
              placeholder="请输入您的验证码"
              v-model="form.authCode"
            >
              <template #right-icon>
                <span
                  class="form-item-msg"
                  @click="sendMsg()"
                  v-show="!showPwdLogin"
                  >{{ textMsg }}</span
                >
              </template>
            </van-field>
          </div>
        </template>
        <!-- 验证密码 -->
        <div class="fs-13 d-flex justify-content-between">
          <router-link to="password" class="color-light pl-1"
            >忘记密码?</router-link
          >
          <!-- <span
            class="color-main pr-1"
            v-if="showPwdLogin"
            @click="showPwdLogin = false"
            >验证码登录</span
          >
          <span class="color-main pr-1" v-else @click="showPwdLogin = true"
            >密码登录</span
          > -->
        </div>
        <!-- 提交按钮 -->
        <div class="mx-6 py-8">
          <van-button block round type="info" class="mb-4" @click="submitForm()"
            >登录</van-button
          >
          <van-button block round type="default" to="register"
            >没有账号? 立即注册</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const loginForm = {
  username: null,
  authCode: null,
  phone: null,
  password: null
}
export default {
  data () {
    return {
      showPwd: false,
      regPhone: /^1([3456789][0-9])\d{8}$/, // 手机号码验证
      regPassword: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/, // 密码验证
      second: 90,
      textMsg: '发送验证码',
      timer: null,
      form: _.assign({}, loginForm),
      showPwdLogin: true,
      isBack: true // 是否是返回上一页面
    }
  },
  methods: {
    // * 发送短信
    sendMsg () {
      if (!this.regPhone.test(this.form.phone)) {
        this.$toast('手机号填写错误')
        return
      }
      this.$http.post(
        this.$apiConf.APP_SMS_CODE,
        {
          phone: this.form.phone,
          sendMsgType: 'login'
        },
        (res) => {
          this.$toast('短信发送成功,请注意查收~')
          this.timer = setInterval(() => {
            this.second--
            this.textMsg = `已发送 ${this.second} s`
            if (this.second <= 0) {
              this.second = 90
              clearInterval(this.timer)
              this.textMsg = '重新发送验证码'
            }
          }, 1000)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // * 提交表单
    submitForm () {
      let _reqUrl = this.$apiUri.APP_LOGIN
      let _params = _.assign(
        {},
        {
          phone: this.form.phone,
          password: this.$md5(this.form.password)
        }
      )
      if (!this.showPwdLogin) {
        _reqUrl = this.$apiUri.APP_LOGIN
        _params = _.assign(
          {},
          {
            phone: this.form.phone,
            code: this.form.authCode
          }
        )
      }
      this.$http.post(
        _reqUrl,
        _params,
        (res) => {
          this.$toast('登录成功!')
          this.form = _.assign({}, loginForm)
          this.$lance.setJson('token', res.data)
          if (this.isBack) {
            this.$router.back()
          } else {
            this.$router.push('center')
          }
          // this.$http.post(this.$apiUri.APP_STORE_INFO, null, rep => {
          //   this.$store.dispatch('login', rep.data)
          // })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'register' || from.name === 'settings') {
      next((vm) => {
        vm.isBack = false
      })
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
@import "./login";
</style>
