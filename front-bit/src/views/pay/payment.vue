<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-23 18:30:36
 * @Description : 支付
-->
<template>
  <div class="pay">
    <div class="pay-amount">
      <h3 class="fs-24 mb-1">
        <span class="fs-12">&yen;</span> <span>{{sumAmount}}</span>
      </h3>
      <van-count-down
        :time="time"
        format="请在mm:ss分内完成支付"
        class="color-muted fs-13"
      />
    </div>

    <div class="pay-way">
      <h4 class="fs-13 p-2 color-light">请选择支付方式</h4>
      <van-radio-group v-model="payway">
        <van-cell-group>
          <van-cell clickable @click="payway = 1" size="large">
            <template #title>
              <div class="d-flex">
                <van-icon name="wechat" class="color-success fs-24 mr-1" />
                <p>微信</p>
              </div>
            </template>
            <template #right-icon>
              <van-radio :name="1" checked-color="#EB6132" />
            </template>
          </van-cell>
          <!-- <van-cell clickable @click="payway = 2" size="large">
            <template #title>
              <div class="d-flex">
                <van-icon name="alipay" class="color-primary fs-24 mr-1" />
                <p>支付宝</p>
              </div>
            </template>
            <template #right-icon>
              <van-radio :name="2" checked-color="#EB6132"/>
            </template>
          </van-cell> -->
        </van-cell-group>
      </van-radio-group>
    </div>

    <div class="pay-btn">
      <van-button type="primary" round block @click="submitPayOrder"
        >立即支付</van-button
      >
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      time: 30 * 60 * 1000,
      payway: 1,
      payList: []
    }
  },
  computed: {
    ...mapState(['userWeixinInfo']),
    sumAmount: function () {
      return _.sum(_.map(this.payList, (v) => v.omsOrder.payAmount))
    }
  },
  mounted () {
    this.payList = this.$lance.getJson('pay-order')
    let time = this.payList[0].omsOrder.createTime
    if (time) {
      let nowTime = new Date().getTime()
      if (nowTime - time > 30 * 60 * 1000) {
        // 订单已失效
        this.$lance.clearStorage('pay-order')
        this.$toast('订单已关闭')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      } else {
        this.time = 30 * 60 * 1000 - (nowTime - time)
      }
    }
  },
  methods: {
    /** 创建支付订单 */
    submitPayOrder () {
      this.$router.replace({
        name: 'payResult',
        query: {
          amount: this.sumAmount,
          status: 'success'
        }
      })
      // let params
      // if (_.size(this.payList) > 1) {
      //   // 多商品
      //   params = {
      //     parentNo: this.payList[0].omsOrder.orderParent,
      //     openId: this.userWeixinInfo.openid
      //   }
      // } else {
      //   // 单商品
      //   params = {
      //     orderNo: this.payList[0].omsOrder.orderNo,
      //     openId: this.userWeixinInfo.openid
      //   }
      // }
      // this.$http.post(this.$apiUri.APP_STORE_PAY_ADD, params, (res) => {
      //   console.log(res)
      //   const _this = this
      //   _this.$wx.wxPay(res.data, () => {
      //     setTimeout(() => {
      //       this.$lance.clearStorage('pay-order') // 清楚缓存订单
      //       _this.$router.replace({
      //         name: 'payResult',
      //         query: {
      //           amount: _.sum(_.map(this.payList, (v) => v.omsOrder.payAmount)),
      //           status: 'success'
      //         }
      //       })
      //     }, 1000)
      //   })
      // })
    }
  }
}
</script>
