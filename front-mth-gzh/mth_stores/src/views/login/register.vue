<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-10 11:33:52
 * @Description : 商户注册
-->
<template>
  <div>
    <div class="imgs">
      <img src="@/assets/images/logo.png" alt="" />
    </div>
    <div class="p">引客·留客·锁客专家</div>
    <div class="form" ref="form">
      <div class="phone">
        手机号
        <van-field
          v-model="phone"
          maxlength="11"
          type="digit"
          placeholder="请输入您的手机号"
          size="large"
          class="py-3"
          :readonly="disabled"
        />
      </div>
      <div class="picker">
        短信验证码
        <van-field placeholder="输入验证码" v-model="dCode">
          <template #button>
            <div>
              <button class="sendSmsBtn" @click="enableRegisterStore" :disabled="disabled">
                {{ text == null ? yzmdjs + '秒重新获取' : text }}
              </button>
            </div>
          </template>
        </van-field>
      </div>

      <div class="but">
        <van-button
          style="background: #eb6133; border: 1px solid #eb6133"
          round
          block
          type="info"
          @click="confirm"
          >注册</van-button
        >
      </div>
      <div v-if="$store.state.storeQuery.type !== '1'" class="reg" @click="toLogin">已有账号？ 登录</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      yzmdjs: '60',
      // password: '',
      text: '获取验证码',
      phone: '',
      dCode: '',
      disabled: false,
      user: false,
      signNo: ''
    }
  },
  methods: {
    // 判断是否能注册店铺
    enableRegisterStore () {
      if (this.$baseUtils.isPhone(this.phone) !== '') {
        return this.$toast(this.$baseUtils.isPhone(this.phone))
      }
      this.$http.post(
        this.$apiUri.APP_USER_IS_REGISTER_STORE,
        { phone: this.phone },
        res => {
          this.user = res.data
          // 发送短信
          this.sendSms()
        }
      )
    },
    toLogin () {
      if (this.$store.state.storeQuery.inWay === 'digitalShelves') {
        // this.$baseUtils.goBack(-1)
        this.$router.push('/')
      } else {
        this.$router.back()
      }
    },
    // 发送验证码
    sendSms () {
      if (this.user) return this.$toast('手机号已存在店铺')
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
        this.$apiUri.APP_REGISTER_STORE_SMS_SIGN,
        {
          mobile: this.phone,
          type: 0
        },
        res => {
          if (res.success) {
            this.signNo = res.data
            this.$http.post(
              this.$apiUri.APP_COMMON_SMS_SEND,
              {
                phone: this.phone,
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
    /**
     * 提交表单
     */
    confirm () {
      if (this.user === true) return this.$toast('手机号已存在店铺')
      if (!this.dCode) return this.$toast('请输入验证码')
      // 验证短信
      this.$http.post(
        this.$apiUri.APP_CHECKSTOREACCOUNTSEND,
        {
          phone: this.phone,
          signNo: this.signNo,
          code: this.dCode
        },
        res => {
          if (res.data) {
            this.$lance.setJson('user-req', {
              phone: this.phone,
              signNo: this.signNo,
              code: this.dCode
            })
            this.$router.push({
              path: 'inApplication',
              query: {
                type: 'register'
              }
            })
          }
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
.sendSmsBtn {
  width: 85px;
  height: 28px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 41px;
  font-size: 13px;
  color: #fff;
}
.reg {
  text-align: center;
  margin-top: -20px;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  color: #eb6133;
  opacity: 1;
}
.edit {
  margin-top: 10px;
  text-align: right;
  margin-bottom: 20px;
  margin-right: 20px;
  color: #ed6133;
}
.register {
  margin-right: 16px;
  float: right;
  width: 344px;
  height: 41px;
  border: 1px solid #c1c1c1;
  background-color: #eee;
  line-height: 41px;
  font-size: 14px;
  color: #999999;
  opacity: 1;
  border-radius: 85px;
  text-align: center;
}
.picker {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.password {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.phone {
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  text-indent: 1em;
  padding-top: 30px;
  border-radius: 8px 8px 0px 0px;
  color: #333333;
  font-weight: 400;
  font-size: 16px;
}
.imgs {
  width: 100%;
  width: 66px;
  height: 58px;
  opacity: 1;
  margin-left: 40%;
  padding-top: 20px;
}
.text {
  width: 72px;
  height: 22px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: #333333;
  opacity: 1;
  margin-left: 14px;
}
.p {
  width: 140px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #eb6133;
  opacity: 1;
  margin-top: 10%;
  margin-left: 33%;
  margin-bottom: 43px;
}
.form {
  margin-top: 12px;
}
.but {
  width: 262px;
  margin: 35px auto;
}
</style>
