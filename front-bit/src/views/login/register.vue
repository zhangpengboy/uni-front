<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 11:21:30
 * @Description  : 商户注册
-->
<template>
  <div class="container">
    <div class="welcome">
      <div>你好,</div>
      <div>欢迎使用！</div>
    </div>
    <div class="logintype">
      <div class="form">
        <!-- 手机号 + 密码 + 验证码 + 邀请码-->
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
        <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>交易密码</span></div>
          <van-field
            :type="showRePwd ? 'text' : 'password'"
            placeholder="请输入您的交易密码"
            v-model="form.payPassword"
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
        </div>
        <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>验证码</span></div>
          <van-field
            type="number"
            placeholder="请输入您的验证码"
            v-model="form.code"
          >
            <template #right-icon>
              <span class="form-item-msg" @click="sendMsg()">
                {{ textMsg }}
              </span>
            </template>
          </van-field>
        </div>

        <!-- 协议 -->
        <div class="fs-13 ml-2 d-flex align-items-center">
          <van-checkbox v-model="checked" icon-size="14" shape="square">
            我已阅读并同意
          </van-checkbox>
          <router-link to="serviceProtocol" class="color-main pl-1">
            《注册服务协议》
          </router-link>
        </div>
        <!-- 提交按钮 -->
        <div class="m-6">
          <van-button block round type="info" @click="submitForm()">
            注册
          </van-button>
          <router-link
            class="d-flex mt-2 fs-14 color-light justify-content-center"
            to="login"
          >
            已有账号? 登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const registerForm = {
  username: null,
  phone: null,
  code: null,
  password: null,
  payPassword: null,
  inviteCode: null,
  signNo: null
}
export default {
  data () {
    return {
      showPwd: false,
      showRePwd: false,
      regPhone: /^1([3456789][0-9])\d{8}$/, // 手机号码验证
      second: 90,
      textMsg: '获取验证码',
      timer: null,
      form: _.assign({}, registerForm),
      disInput: false,
      enterType: null,
      checked: false
    }
  },
  mounted () {
    this.form.inviteCode = this.$route.query.inviteCode || null
    this.enterType = this.$route.query.enter
    if (!_.isEmpty(this.form.inviteCode)) {
      this.disInput = true
    }
  },
  methods: {
    // * 发送短信
    sendMsg () {
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号填写错误')
      }
      this.$http.post(
        this.$apiUri.APP_REGIST_SMS_SGIN,
        {
          mobile: this.form.phone
        },
        (rep) => {
          this.form.signNo = rep.data
          this.$http.post(
            this.$apiUri.APP_COMMON_SEND_MSG,
            {
              signNo: rep.data,
              mobile: this.form.phone
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
            }
          )
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // * 提交表单
    submitForm () {
      if (!this.checked) {
        return this.$toast('请勾选同意注册服务协议')
      }
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号填写错误')
      }
      if (this.form.code === '') {
        return this.$toast('验证码不能为空')
      }

      const _params = _.assign(
        {},
        {
          username: `矿友${this.form.phone.slice(-4)}`,
          phone: this.form.phone,
          code: this.form.code,
          password: this.$md5(this.form.password),
          payPassword: this.$md5(this.form.payPassword),
          inviteCode: this.form.inviteCode,
          signNo: this.form.signNo
        }
      )
      this.$http.post(
        this.$apiUri.APP_REGIST,
        _params,
        () => {
          this.$toast('注册成功~')
          this.form = _.assign({}, registerForm)
          this.$http.post(this.$apiUri.APP_LOGIN, _params, (res) => {
            this.$lance.setJson('token', res.data)
            this.$router.push('center')
          })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./login";
</style>
