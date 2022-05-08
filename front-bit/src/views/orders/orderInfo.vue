<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-22 11:07:38
 * @Description : 订单详情
-->
<template>
  <div class="order">
    <van-nav-bar
      title="订单详情"
      left-arrow
      @click-left="onClickLeft"
      fixed
      :border="false"
      placeholder
    />
    <div class="order-topbg"></div>
    <div class="main-wrap order-status mb-2">
      <div class="main-wrap-cont">
        <div class="d-flex align-items-center mb-6">
          <div class="img">
            <img  v-if="orderData.status" :src="getImg(orderData.status)" />
          </div>
          <div class="title">
            <h2 class="mb-2">{{ orderData.status | filterOrderPayStatus }}</h2>
            <p class="van-ellipsis fs-13">
              <span class="color-light">创建时间：</span
              ><span>{{ $lance.parseTime(orderData.createTime) }}</span>
            </p>
          </div>
        </div>
        <div class="sn">
          <p class="van-ellipsis fs-13 pl-2">
            <span class="color-light">订单号 </span>
            <span>{{ orderData.orderNo }}</span>
          </p>
          <div class="copy">
            <span
              v-clipboard:copy="orderData.orderNo"
              v-clipboard:success="onCopy"
              >复制</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 矿机信息 -->
    <div class="main-wrap pt-1">
      <van-cell :title="orderData.productName" />
      <van-cell :border="false" class="color-light mb-1" title="购买台数">
        x{{ orderData.num }}
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="矿机总价">
        {{ orderData.machineMoney }} CNY
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="电费单位">
        {{ orderData.powerPrice }} CNY/度
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="预交天数">
        {{ orderData.day }}天
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="预交电费金额">
        {{ orderData.powerMoney }} CNY
      </van-cell>
      <van-cell :border="false" class="mb-1" title="订单金额">
        <span class="fs-20 fw-b">{{ orderData.money }}</span>
        <span class="fs-12"> CNY </span>
      </van-cell>
    </div>

    <div class="main-wrap">
      <van-cell :border="false" class="color-light mb-1" title="支付时间">
        {{ $lance.parseTime(orderData.createTime) }}
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="支付方式">
        {{ orderData.payType | filterBitType }} 支付
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="预计开始时间">
        {{ $lance.parseTime(orderData.dayStart) }}
      </van-cell>
      <van-cell :border="false" class="color-light mb-1" title="预计结束时间">
        {{ $lance.parseTime(orderData.dayEnd) }}
      </van-cell>
    </div>

    <!-- 状态 -->
    <template v-if="orderData.omsOrder">
      <div class="order-goods-footer">
        <span class="cbtn" @click="cancelOrder(orderData.omsOrder.orderNo)">
          取消订单
        </span>
        <span class="cbtn main" @click="toPayment()">立即付款</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 0->待付款；1->上架中；2->挖矿中；3->已完成；4->已关闭
      status: 0,
      // 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝
      applyStatus: null,
      orderNo: '',
      orderData: {},
      showReasonFlag: false,
      reason: null
    }
  },
  mounted () {
    this.orderNo = this.$route.query.orderNo
    this.getOrderInfo()
  },
  methods: {
    /** 获取订单详情 */
    getOrderInfo () {
      this.$http.post(
        this.$apiUri.APP_PORDER_INFO,
        { orderNo: this.orderNo },
        (res) => {
          console.log(res.data)
          this.orderData = res.data
        }
      )
    },
    /* 根据状态获取图片 */
    getImg (status) {
      return require('@/assets/images/order/' +
        [
          'order-status-0@2x.png',
          'order-status-1@2x.png',
          'order-status-2@2x.png',
          'order-status-3@2x.png',
          'order-status-4@2x.png'
        ][status])
    },
    /** 取消订单 */
    cancelOrder (orderNo) {
      this.$dialog
        .confirm({
          title: '取消订单',
          message: '是否取消订单'
        })
        .then((result) => {
          this.$http.post(
            this.$apiUri.APP_STORE_ORDER_CANCEL,
            { orderNo },
            (res) => {
              this.$toast.clear()
              this.$toast('取消成功')
              this.init()
            }
          )
        })
    },
    /** 去支付 */
    toPayment () {
      this.$lance.setJson('pay-order', [this.orderData])
      this.$router.push('payment')
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    /** 复制 */
    onCopy () {
      this.$toast('订单号已复制到剪切板')
    }
  }
}
</script>
