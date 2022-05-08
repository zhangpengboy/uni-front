<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 14:42:55
 * @Description : 提现
-->

<template>
  <div>
    <div class="boxTop">
      <div class="htxje">可提现金额 (元)</div>
      <div class="topposit">
        <div style="font-size: 16px; font-weight: 500; color: #333333">
          {{ freeAmount }}
        </div>
        <div @click="toAll()" class="positRigin">全部提现</div>
      </div>
    </div>
    <div class="center">
      <div class="txje">提现金额</div>
      <div style="display: flex">
        <span
          style="
            margin-left: 18px;
            font-size: 30px;
            text-align: center;
            line-height: 50px;
          "
          >￥</span
        >
        <input
          style="font-size: 20px; font-weight: 600"
          type="number"
          placeholder="输入提现金额"
          maxlength="8"
          v-model="form.money"
          @keydown="InoutChange"
        />
        <!-- <van-field
          name="pattern"
          :rules="[{ pattern }]"
          style="font-size: 20px; font-weight: 600"
          v-model.number="form.money"
          placeholder="输入提现金额"
          :readonly="disabled"
          type="number"
        ></van-field> -->
      </div>
    </div>
    <div>
      <van-form>
        <van-field
          v-model="form.cardNo"
          label="到账支付宝"
          readonly
          size="large"
          class="py-3"
        ></van-field>
        <van-field
          v-model="form.cardName"
          label="真实姓名"
          readonly
          size="large"
          class="py-3"
        ></van-field>
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="form.code"
          size="large"
          class="py-3"
        >
          <template #button>
            <div class="yz-span">
              <button
                type="button"
                class="sendSmsBtn"
                @click="sendSms"
                :disabled="disabled"
              >
                {{ text == null ? yzmdjs + '秒重新获取' : text }}
              </button>
            </div>
          </template>
        </van-field>
        <div style="margin: 30px 16px">
          <van-button round block type="warning"
          :loading="loading" loading-text="提现中..." @click="handleWithdraw"
            >立即提现</van-button
          >
        </div>
      </van-form>
    </div>
    <div style="margin-left: 14px;margin-bottom: 20px;">
      <div style="font-size: 14px; color: #333333; margin-bottom: 8px">
        提现说明
      </div>
      <div style="font-size: 13px; color: #666666; margin-bottom: 4px">
        1.提现金额:单笔提现金额<span style="font-size: 16px; font-weight: 600"
          >1-50000</span
        >元
      </div>
      <div style="font-size: 13px; color: #666666">2.手续费:单笔费率0.01%</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      freeAmount: '',
      disabled: false,
      yzmdjs: '60',
      text: '获取验证码',
      alipay: {},
      form: {
        accountId: null,
        cardNo: null,
        cardName: null,
        cardType: 1,
        code: null,
        mobile: null,
        money: null,
        signNo: null
      },
      loading: false
    }
  },
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  created () {
    this.getMoneyInfo()
  },
  methods: {
    InoutChange (e) {
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null
    },

    // 根据账户获取绑定的支付宝账号
    getAlipayUser () {
      this.$http.post(
        this.$apiUri.APP_ADD_GET_ALIPAY,
        { userId: this.userWeixinInfo.id },
        res => {
          // if (res.data == null) {
          //   return this.$router.push('/binding')
          // }
          this.alipay = res.data
          this.form.accountId = res.data.accountId
          this.form.mobile = res.data.phone
          this.form.cardNo = res.data.account
          this.form.cardName = res.data.userName
        }
      )
    },
    // 获取用户资产总数
    getMoneyInfo () {
      this.$http.post(
        this.$apiUri.APP_MONEY,
        {
          userId: this.userWeixinInfo.id
        },
        res => {
          console.log(111, res)
          this.freeAmount = res.data.freeAmount.toFixed(2).toString()
          this.getAlipayUser()
        }
      )
    },
    // 发送短信
    sendSms () {
      if (!this.form.money) return this.$toast('提现金额为空')
      if (+this.form.money > +this.freeAmount) {
        return this.$toast('提现金额大于可用金额')
      }
      // if (this.form.money.match(/^\d*(\.?\d{0,3})/g)[0] || null) {
      //   return this.$toast('小数不能大于两位数')
      // }
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
        this.$apiUri.APP_ADD_TX_SIGNO,
        {
          mobile: this.alipay.phone
        },
        res => {
          if (res.success) {
            this.form.signNo = res.data
            this.$http.post(
              this.$apiUri.APP_ADD_TX_SES,
              {
                mobile: this.alipay.phone,
                signNo: res.data
              },
              res => {
                if (res.success) {
                  this.$toast('短信发送成功')
                } else {
                  this.$toast('短信发送失败')
                }
              }
            )
          }
        }
      )
    },

    handleWithdraw () {
      // if (!this.form.money>this.freeAmount) return this.$toast('提现金额')
      let reg = /^\d*(\.?\d{0,1})/g
      if (!reg.test(this.form.money)) {
        return this.$toast('请输入正确的金额')
      }
      if (!this.form.cardNo) return this.$toast('支付宝账号为空')
      if (!this.form.cardName) return this.$toast('支付宝名称为空')
      if (+this.freeAmount === 0) return this.$toast('可提现金额为0,无法提现')
      if (+this.form.money > +this.freeAmount) {
        return this.$toast('提现金额大于可用金额')
      }
      if (!this.form.money) return this.$toast('提现金额为空')
      if (!this.form.code) return this.$toast('短信验证码为空')
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_ADD_TX_ZFB,
        this.form,
        res => {
          this.loading = false
          this.$toast(res.data)
          this.$router.push('/wallet')
        },
        err => {
          this.loading = false
          this.$toast(err.message)
        }
      )
    },

    // 全部提现
    toAll () {
      if (+this.freeAmount === 0) {
        return this.$toast('可提现金额为0,无法提现')
      }
      this.form.money = this.freeAmount
    }
  }
}
</script>

<style lang="less" scoped>
.boxTop {
  width: 375px;
  height: 72px;
  margin-top: 12px;
  background: #ffffff;
  opacity: 1;
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
.txje {
  font-size: 14px;
  padding-top: 12px;
  text-indent: 2em;
  font-weight: 500;
  color: #333333;
  margin-bottom: 30px;
}
.center {
  width: 375px;
  height: 124px;
  background: #ffffff;
  opacity: 1;
  margin-top: 12px;
  margin-bottom: 12px;
}
.htxje {
  color: #999999;
  font-size: 13px;
  padding-top: 12px;
  text-indent: 2em;
}
.topposit {
  display: flex;
  text-indent: 2em;
  margin-top: 12px;
}
.positRigin {
  margin-left: 45%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #eb6133;
  opacity: 1;
}
</style>
