<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 11:21:30
 * @Description  : 重置支付密码
-->
<template>
  <div class="container">
    <div class="logintype">
      <div class="form">
        <!-- 手机号 + 密码 + 验证码 + 邀请码-->
        <!-- <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>账户手机号：</span><span class="form-phone">{{ user.phone }}</span></div>
          <van-field
            type="tel"
            v-model="form.phone"
            readonly
            maxlength="11"
          />
        </div> -->
        <div class="form-item van-hairline--bottom">
          <div class="form-item-label"><span>支付密码</span></div>
          <van-field
            :type="showPwd ? 'text' : 'password'"
            placeholder="请输入您的支付密码"
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
          <div class="form-item-label"><span>确认支付密码</span></div>
          <van-field
            :type="showRePwd ? 'text' : 'password'"
            placeholder="请再次输入您的支付密码"
            v-model="form.rePassword"
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
        <!-- 提交按钮 -->
        <div class="m-6">
          <van-button block round type="info" @click="submitForm()">
            确定
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
const registerForm = {
  phone: null,
  code: null,
  password: null,
  rePassword: null,
  signNo: null
}
export default {
  data () {
    return {
      showPwd: false,
      showRePwd: false,
      second: 90,
      textMsg: '获取验证码',
      timer: null,
      form: _.assign({}, registerForm)
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // * 发送短信
    sendMsg () {
      this.$http.post(
        this.$apiUri.APP_RESET_PAY_PWD_SMS_SGIN,
        {
          mobile: this.user.phone
        },
        (rep) => {
          this.form.signNo = rep.data
          this.$http.post(
            this.$apiUri.APP_COMMON_SEND_MSG,
            {
              signNo: rep.data,
              mobile: this.user.phone
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
      if (this.form.code === '') {
        return this.$toast('验证码不能为空')
      }
      if (this.form.password !== this.form.rePassword) {
        return this.$toast('输入密码不一致，重新输入')
      }

      const _params = _.assign(
        {},
        {
          userId: this.user.phone,
          code: this.form.code,
          password: this.$md5(this.form.password),
          signNo: this.form.signNo
        }
      )
      this.$http.post(
        this.$apiUri.APP_RESET_PAY_PWD,
        _params,
        (res) => {
          this.$toast('支付密码重置成功!')
          this.$lance.setJson('token', res.data)
          this.form = _.assign({}, registerForm)
          this.$router.go(-1)
        //   this.$router.push('login')
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
@import "../../login/login.scss";
.logintype {
  top: 5%;
  min-height: 95vh;
  .form-phone {
    font-weight: 300;
  }
}

</style>
