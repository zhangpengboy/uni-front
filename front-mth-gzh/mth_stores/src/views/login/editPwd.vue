<template>
  <div>
    <van-form>
      <van-field
        v-model="phone"
        maxlength="11"
        type="tel"
        placeholder="请输入手机号"
        label="手机号"
      />
      <van-field
        center
        clearable
        label="验证码"
        placeholder="输入验证码"
        v-model="yzmin"
      >
        <template #button>
          <div>
            <button class="sendSmsBtn" @click="sendSms" :disabled="disabled">
              {{ text == null ? yzmdjs + '秒重新获取' : text }}
            </button>
          </div>
        </template>
      </van-field>
      <van-field
        v-model="password"
        type="password"
        placeholder="请输入新密码"
        label="新登录密码"
      />
      <div class="button">
        <van-button round class="buy" @click="confirm" color="#ed6133"
          >确定</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      disabled: false,
      intervalBtn: null,
      yzmdjs: '60',
      text: '获取验证码',
      password: '',
      phone: '',
      yzmin: ''
    }
  },
  created () {},
  methods: {
    // 发送验证码
    sendSms () {
      if (!this.phone) {
        return this.$toast('手机号不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.phone
        )
      ) {
        return this.$toast('手机号不正确')
      }
      if (!this.phone) return this.$toast('请输入手机号')
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
        this.$apiUri.APP_ADD_UPDTA_SMSIGN,
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
                mobile: this.phone,
                signNo: res.data
                // code: this.yzmin
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
    confirm () {
      if (!this.phone) {
        return this.$toast('手机号不能为空')
      }
      if (
        !/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
          this.phone
        )
      ) {
        return this.$toast('手机号不正确')
      }
      if (!this.phone) return this.$toast('请输入手机号')
      if (!this.yzmin) return this.$toast('请输入验证码')
      if (!this.password) return this.$toast('请输入新密码')
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_WDRD,
        {
          phone: this.phone,
          signNo: this.signNo,
          code: this.yzmin,
          password: this.password
        },
        res => {
          console.log(res)
          this.$router.push('/')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
  margin: 0 auto;
  margin-top: 30px;
  .buy {
    width: 300px;
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
