<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 14:44:57
 * @Description : 绑定支付宝详情
-->
<template>
  <div>
    <div class="div">已绑定支付宝</div>
    <div class="pay">
      <van-field
        v-model="alipay.account"
        label="到账支付宝"
        readonly
        size="large"
        class="py-3"
      ></van-field>
      <van-field
        v-model="alipay.userName"
        label="真实姓名"
        readonly
        size="large"
        class="py-3"
      ></van-field>
    </div>
    <div class="ts">提示</div>
    <div class="kf">
      为保障您的资金安全，暂不提供更换已绑定的支付宝账户， 若需要
      更换支付宝账户，请拨打客服电话：

      <span style="color: #ec221e; font-size: 13px"> 4006235126 </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      alipay: {},
      userId: ''
    }
  },
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  mounted () {
    this.getAlipayUser()
  },
  methods: {
    // 根据账户获取绑定的支付宝账号
    getAlipayUser () {
      this.$http.post(
        this.$apiUri.APP_ADD_GET_ALIPAY,
        { userId: this.userWeixinInfo.id },
        res => {
          if (res.success) {
            this.alipay = res.data
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
// .{
//   sdafdsf

// }
.div {
  height: 44px;
  line-height: 44px;
  background: #f3f3f3;
  font-size: 14px;
  text-indent: 1em;

  color: #333333;
}
.pay {
  color: #333333;
  margin-bottom: 12px;
}
.ts {
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #333333;
  opacity: 1;
  margin-bottom: 5px;
  margin-left: 14px;
}
.kf {
  width: 336px;
  height: 34px;
  font-size: 12px;
  font-weight: 300;
  line-height: 17px;
  color: #999999;
  margin-left: 14px;
  opacity: 1;
}
</style>
