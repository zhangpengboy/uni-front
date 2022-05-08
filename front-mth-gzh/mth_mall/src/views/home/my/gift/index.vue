<template>
  <div>
    <div class="box">
      <div class="text">数字货架说明</div>
      <!-- <div class="text_one">一、数字货架说明</div> -->
      <div class="text_text">
        依托实体店闲置的空间及货架，优化陈列00后用户群喜欢的匠心产品，用户能直观触摸到商品，用户体验后，直接用手机扫标签上的二维码进入实体店云店页面直接下单购买。
      </div>
      <div class="text_text">
        1.让货架不再闲置
      </div>
      <div class="text_text">
        2.上架产品就能挣钱
      </div>
      <div class="text_text">
        3.智能优化店铺
      </div>
      <div class="text_text">
        4.推广1次，终身挣钱
      </div>
      <div class="text_text">
        5.让电商真正的来到身边
      </div>

      <!-- <div class="text_two">二、365礼包权益</div>
      <div class="text_buo">
        欢迎您下载和使用我们的APP,依照相关法规规定，为了
        您正常使用拾惠街市APP，你的身份信息、联系方式、交易信
        息需要被依法收集并使用。
      </div>
      <div class="text_buo">
        拾惠街市将严格保护您的个人信息，确保信息安全，具体
        详见《拾惠街市隐私政策》。
      </div>
      <div class="text_buo">
        您在点击同意下列协议前，请您务必审慎阅读《服务协
        议》和《隐私政策》并充分理解协议条款内容。
      </div> -->
    </div>
    <div v-if="isshow == 0" @click="tolanceYi" class="buttom">
      免费开通数字货架
    </div>
    <div v-if="isshow == 1" @click="topay" class="buttom">付费体验数字货架</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  data () {
    return {
      isshow: 0,
      money: '',
      resPay: '',
      toUrl: ''
    }
  },
  created () {
    this.isshow = this.$route.query.isFree
    this.toUrl = this.$lance.getJson('h5Url').filter(item => item.webCode === 'H5_S001').webUrl + 'register?inWay=digitalShelves'
    this.getMoney()
  },
  methods: {
    getMoney () {
      this.$http.post(this.$apiUri.APP_GETMONEY, {}, res => {
        if (res.success) {
          let mm = res.data
          this.money = JSON.parse(mm).money
        }
      })
    },

    tolanceYi () {
      this.$toast.loading({ message: '加载中...', forbidClick: true })
      // window.open('https://store.meitianhui.com/register', '_self')
      window.open(this.toUrl, '_self')
    },

    topay () {
      this.$http.post(
        this.$apiUri.APP_DEPOSITADD,
        { payType: 3, amount: this.money, bsType: 'BS_A011' },
        res => {
          // 全等就不走逻辑，比较才可以
          if (res.data === 0 || res.data === '0') {
            // 已开通数字货架充值
            return window.open(this.toUrl, '_self')
          } else {
            let objPaylet = {
              openId: this.userWeixinInfo.openid,
              orderNo: res.data,
              payType: 3,
              bsType: 'BS_A011'
            }
            this.$http.post(this.$apiUri.APP_PAYADD, objPaylet, res => {
              this.$wxApi.wxPay(
                res.data,
                res => {
                  // window.open('https://shop.lanceyi.com/register', '_self')
                  window.open(this.toUrl, '_self')
                },

                err => {
                  console.log(111, err)
                  this.$toast('支付失败')
                }
              )
            })
          }
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
.box {
  margin: 24px 17px 50px 18px;
}
.text_buo {
  text-indent: 27px;
  line-height: 20px;
  font-size: 13px;
  font-weight: 300;
  color: #333333;
  opacity: 1;
}
.text_two {
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  opacity: 1;
}
.text_text {
  line-height: 20px;
  text-indent: 27px;
  font-size: 13px;
  font-weight: 300;
  color: #333333;
  opacity: 1;
}
.text_one {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  opacity: 1;
}
.text {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  opacity: 1;
  margin-bottom: 24px;
}
.buttom {
  width: 262px;
  height: 38px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 41px;
  color: #fff;
  text-align: center;
  line-height: 38px;
  margin-left: 16%;
}
</style>
