<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-25 17:17:12
 * @Description : 支付结果页面
-->
<template>
  <div class="pay">
    <div class="pay-result">
      <van-icon :name="require('@/assets/images/pay/status-success@2x.png')" size="150"/>
      <p class="fs-14 my-2">支付成功</p>
      <p class="mb-10"><span class="fs-10">&yen;</span><span class="fs-24">{{query.amount}}</span></p>
      <van-row>
        <van-col span="10" offset="1"><van-button round plain block type="default" url="home">返回首页</van-button></van-col>
        <van-col span="10" offset="2"><van-button round plain block type="warning" url="orderList">查看订单</van-button></van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: {}
    }
  },
  mounted () {
    this.query = this.$route.query
    console.log(this.query)
    if (!this.query) {
      this.$router.back()
    }
  }
}
</script>
