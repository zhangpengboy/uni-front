<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 代理商注册
-->
<template>
  <div class="register">
    <img  class="imgs" src="@/assets/images/logo.png" alt="" />
    <div class="p">引客·留客·锁客专家</div>
    <div class="form" ref="form">
      <van-form>
        <div class="picker">
          <span class="fs-16 fw-700">手机号</span>
          <van-field
            v-model="form.phone"
            maxlength="11"
            placeholder="请输入您的手机号"
            class="py-2"
          />
        </div>
        <div class="picker">
          <span class="fs-16 fw-700">密码</span>
          <van-field
            v-model="form.password"
            type="password"
            placeholder="请输入您的密码"
            class="py-2"
          />
        </div>
        <div class="picker ">
          <span class="fs-16 fw-700">验证码</span>
          <van-field
            type="number"
            placeholder="请输入您的验证码"
            v-model="form.code"
          >
            <template #button>
              <van-button
              size="small"
              round
              type="primary"
              color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
              @click="sendMsg"
              class="cbtn"
              >{{ textMsg }}</van-button>
            </template>
          </van-field>
          <!-- <div class="msg">{{ textMsg }}</div> -->
        </div>
      <van-button
        class="but"
        round
        block
        type="info"
        @click="submitForm"
        >注册</van-button
      >
      </van-form>
    </div>
  </div>
</template>

<script>
const registerForm = {
  phone: null,
  password: null,
  code: null,
  signNo: null
}
export default {
  data () {
    return {
      second: 90,
      textMsg: '发送验证码',
      form: _.assign({}, registerForm),
      rules: {},
      regPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
    }
  },
  methods: {
    sendMsg () {
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号为空或填写错误')
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
    submitForm () {
      if (!this.regPhone.test(this.form.phone)) {
        return this.$toast('手机号为空或填写错误')
      }
      if (!this.form.password) {
        return this.$toast('密码不能为空或错误')
      }
      if (this.form.code === '') {
        return this.$toast('验证码不能为空')
      }

      const _params = _.assign(
        {},
        {
          phone: this.form.phone,
          code: this.form.code,
          password: this.$md5(this.form.password),
          signNo: this.form.signNo
        }
      )
      this.$http.post(
        this.$apiUri.APP_REGIST,
        _params,
        () => {
          this.$toast('注册成功~')
          this.form = _.assign({}, registerForm)
          this.$router.push('agentApply')
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-cell {
  padding: 10px 0;
}
.register {
  width: 100%;
  height: 100%;
  text-align: center;
}
.imgs {
  width: 66px;
  height: 66px;
  margin: 24px 0 14px;
}
.p {
  width: 140px;
  height: 20px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #eb6133;
  margin: 0 auto 24px;
}
.form {
  // min-height: 411px;
  background-color: #fff;
  border-radius: 8px 8px 0px 0px;
  padding: 20px 30px;
  text-align: left;
}
.picker {
  border-bottom: 1px solid #f3f3f3;
  padding-top: 12px;
  color: #333333;
}

</style>
