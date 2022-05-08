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
        <span v-if="integralType == 0"
          >+<span style="font-size:30px">{{ payIntegral }}</span
          ><span style="font-size:22px">礼券</span></span
        >
        <!-- <span v-if="integralType == 1"> 送 </span
        > -->
      </div>
      <!-- <div class="buttom">
        <span>请在</span>&nbsp;<span style="color:#EB6133;"
          ><van-count-down :time="time" format="mm:ss"/></span
        >&nbsp;<span>内完成支付</span>
      </div> -->
    </div>
    <!-- <van-cell title="订单编号" :value="orderNo" /> -->
    <div class="d-flex justify-content-between align-items-center px-3 bg-white">
      <span class="fs-14 color-text">订单编号</span>
      <span class="fs-13 color-text">{{ orderNo }}</span>
    </div>
    <van-divider/>
    <div class="select">请选择支付方式</div>
    <!-- <div class="selectList">
      <div>
        <van-image
          style="margin-top: 13px;margin-left:15px;margin-right:12px"
          width="27"
          height="22"
          :src="require('../../assets/images/logo.png')"
        />
      </div>
      <span style="font-size:16px;margin-right: 5px;">礼券支付</span
      ><span style="font-size:13px;">(礼券余额103个)</span>
      <div class="iocn"><van-icon name="success" /></div>
    </div> -->
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
      salePrice: null,
      payIntegral: null,
      postage: null, // 运费
      payAmount: null // 支付金额
    }
  },
  created () {
    // console.log(this.postStoreList.salePrice)

    this.orderNo = this.$route.query.orderNo
    this.integralType = this.$route.query.integralType
    // console.log(111, this.$route.query.integralType)
    this.getGoodsOrderDetail()
  },
  methods: {
    // onClickLeft () {
    //   this.$toast('你已取消支付')
    //   this.$router.go(-2)
    // },
    // 获取订单信息
    getGoodsOrderDetail () {
      this.$http.post(
        this.$apiUri.APP_USERORDERDETAIL,
        { orderNo: this.orderNo },
        res => {
          this.payInfo = res.data
          this.salePrice = res.data.omsOrderDetail.salePrice
          this.postage = res.data.omsOrder.postage
          this.payAmount = res.data.omsOrder.payAmount
          if (res.data.omsOrderDetail.integral && res.data.omsOrderDetail.goodsNum) {
            this.payIntegral = new Decimal(res.data.omsOrderDetail.integral)
              .mul(new Decimal(res.data.omsOrderDetail.goodsNum))
            console.log('this.payIntegral:', this.payIntegral)
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    payAdd () {
      this.$http.post(
        this.$apiUri.APP_PAYADD,
        {
          payType: 3,
          openId: this.userWeixinInfo.openid,
          orderNo: this.payInfo.omsOrder.orderNo,
          bsType: this.payInfo.omsOrder.bsType
        },
        res => {
          if (res.data.status === true) {
            this.$lance.setData('salePrice', this.payAmount)
            this.$router.push('accomplish')
          } else {
            this.$wxApi.wxPay(
              res.data,
              res => {
                // console.log(222, res)
                this.$lance.setData('salePrice', this.payAmount)

                this.$router.push('/accomplish')
              },

              err => {
                console.log(111, err)
                this.$toast('支付失败')
                this.$router.push('/orderList')
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
