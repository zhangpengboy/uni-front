<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 充值状态
-->

<template>
  <div class="center recharge p-footer">
    <div class="recharge-status van-hairline--bottom">
      <template v-if="order.status == 0 || order.status == 1">
        <van-icon :name="require('@/assets/images/order/status0@2x.png')" class="color-main" size="80" />
        <h3 class="color-main my-2">处理中</h3>
      </template>
      <template v-else-if="order.status == 2">
        <van-icon :name="require('@/assets/images/order/status1@2x.png')" class="color-main" size="80" />
        <h3 class="color-main my-2">已完成</h3>
      </template>
      <template v-else>
        <van-icon :name="require('@/assets/images/order/status4@2x.png')" class="color-main" size="80" />
        <h3 class="color-main my-2">已取消</h3>
      </template>
      <p class="fs-12 color-light">
        确认转账后资产会在10分钟内到账，若未及时到账请联系平台客服
      </p>
    </div>

    <!-- 充值订单信息  -->
    <van-cell-group :border="false" class="mt-4">
      <van-cell center>
        <template #title>
          <span class="color-light">充值流水号</span>
        </template>
        <template #default>
          <span class="fs-12 fw-b">{{ order.orderNo }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">充值金额(CNY)</span>
        </template>
        <template #default>
          <span class="fs-12 color-main">{{ order.money }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">实付金额</span>
        </template>
        <template #default>
          <span class="fs-12 color-main">{{ order.money }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">付款方式</span>
        </template>
        <template #default>
          <span class="fs-12 fw-b">银行卡转账</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">付款方信息</span>
        </template>
        <template #default>
          <span class="fs-12">{{ order.transUserName }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">创建时间</span>
        </template>
        <template #default>
          <span class="fs-12 fw-b">{{
            $lance.parseTime(order.createTime)
          }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 底部 -->
    <div class="footer-btn">
      <van-button block type="info" to="center" replace> 完成 </van-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      order: {},
      orderNo: null
    }
  },
  mounted () {
    this.orderNo = this.$route.query.orderNo
    this.getRechargeOrder()
  },
  methods: {
    /** 获取订单详情 */
    getRechargeOrder () {
      this.$http.post(
        this.$apiUri.APP_RECHARGE_ORDER_INFO,
        {
          orderNo: this.orderNo
        },
        (res) => {
          this.order = res.data
        }
      )
    }
  }
}
</script>
