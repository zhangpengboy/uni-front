<template>
  <div class="bg-white">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="money">
      <div class="top">
        <span style="font-size:20px">￥</span
        ><span style="font-size:30px">{{ payAmount }}</span>
        <span v-if="payIntegral < 0"
          >+<span style="font-size:30px">{{ Math.abs(payIntegral) }}</span
          ><span style="font-size:22px">礼券</span></span
        >
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center px-3 bg-white">
      <span class="fs-14 color-text">订单编号</span>
      <span class="fs-13 color-text">{{ orderNo }}</span>
    </div>
    <van-divider/>
    <div class="select">请选择支付方式</div>
    <div class="selectList">
      <div>
        <van-image
          style="margin-top: 0.35135rem;margin-left:0.40540rem;margin-right: 0.32432rem"
          width="27"
          height="22"
          :src="require('../../assets/images/payicon.png')"
        />
      </div>
      <span style="font-size:16px;margin-right: 0.13513rem;">微信支付</span>
      <div class="iocns"><van-icon name="success" /></div>
    </div>
    <van-button class="buttomSut" round type="info" @click="accomplishs"
      >立即付款</van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Decimal from 'decimal.js-light'
export default {
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  data () {
    return {
      // time: 10 * 60 * 1000,
      payInfo: {},
      orderNo: '',
      bsType: '',
      salePrice: null,
      payIntegral: null,
      postage: null, // 运费
      payAmount: null // 支付金额
    }
  },
  created () {
    this.getGoodsOrderDetail()
  },
  methods: {
    // 获取订单信息
    getGoodsOrderDetail () {
      let obj = {}
      if (this.$route.query.orderNo) {
        obj.orderNo = this.$route.query.orderNo
        this.orderNo = this.$route.query.orderNo
      } else {
        obj.parentNo = this.$route.query.parentNo
        this.orderNo = this.$route.query.parentNo
      }
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_DETAIL,
        obj,
        res => {
          this.payInfo = res.data
          this.bsType = res.data[0].bsType
          if (res.data.length) {
            this.payIntegral = 0
            this.payAmount = 0
            this.payInfo.map(item => {
              if (item.integralType === 0) {
                this.payIntegral -= item.integral * item.goodsNum
              } else {
                this.payIntegral += item.integral * item.goodsNum
              }

              this.payAmount = new Decimal(this.payAmount).add(new Decimal(item.salePrice)
                .mul(new Decimal(item.goodsNum)))
              // this.payAmount.toFixed(2)
            })
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    payAdd () {
      let obj = {
        payType: 3,
        openId: this.userWeixinInfo.openid,
        bsType: this.bsType,
        parentNo: this.$route.query.parentNo
      }
      // if (this.$route.query.orderNo) {
      //   obj.orderNo = this.$route.query.orderNo
      // } else {

      // }
      this.$http.post(
        this.$apiUri.APP_PAYADD,
        obj,
        res => {
          if (res.data.status === true) {
            this.$lance.setData('salePrice', this.payAmount)
            this.$router.push({
              path: '/accomplish',
              query: {
                type: '1'
              }
            })
            // this.$router.push('accomplish')
            this.$lance.clearStorage('buy_storeGoods')
          } else {
            this.$wxApi.wxPay(
              res.data,
              res => {
                this.$lance.setData('salePrice', this.payAmount)
                this.$router.push({
                  path: '/accomplish',
                  query: {
                    type: '1'
                  }
                })
                // this.$router.push('/accomplish')
                this.$lance.clearStorage('buy_storeGoods')
              },
              err => {
                console.log(111, err)
                this.$lance.clearStorage('buy_storeGoods')
                this.$toast('支付失败')
                this.$router.go(-2)
                // this.$router.push('/orderList')
              }
            )
          }
        }
      )
    },
    accomplishs () {
      this.payAdd()
      //
    },
    onClickLeft () {
      this.$router.go(-2)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  /* padding: 10px 12px; */
  color: #333333;
  font-size: 0.37333rem;
  /* line-height: 0.64rem; */
  background-color: #fff;
  padding-left: 16px;
}
.buttomSut {
  width: 262px;
  height: 39px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border: #eb6133;
  border-radius: 41px;
  margin-left: 55px;
  margin-top: 170px;
  margin-bottom: 30px;
}
.selectList {
  display: flex;
  color: #333333;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  border-bottom: 1px solid rgb(235, 228, 228);
  .iocn {
    margin-left: 120px;
    font-size: 20px;
    color: #eb6133;
  }
  .iocns {
    margin-left: 215px;
    font-size: 20px;
    color: #eb6133;
  }
}
.select {
  height: 50px;
  font-size: 13px;
  font-weight: 300;
  line-height: 18px;
  padding-left: 17px;
  color: #999999;
  opacity: 1;
  border-bottom: 1px solid rgb(235, 228, 228);
  background-color: #fff;
  line-height: 50px;
}
.money {
  height: 130px;
  background-color: #fff;
  text-align: center;
  .top {
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #333333;
    opacity: 1;
    padding-top: 30px;
    padding-bottom: 10px;
  }
  .van-count-down {
    color: #eb6133;
    font-size: 0.37333rem;
    line-height: 0.53333rem;
  }
  .buttom {
    display: flex;
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    color: #333333;
    opacity: 1;
    margin-left: 115px;
  }
}
</style>
