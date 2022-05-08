<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 提现状态
-->

<template>
  <div class="center recharge p-footer">
    <div class="recharge-status van-hairline--bottom">
      <template v-if="order.status == 0">
        <van-icon
          :name="require('@/assets/images/order/status0@2x.png')"
          class="color-main"
          size="80"
        />
        <h3 class="color-main my-2">处理中</h3>
      </template>
      <template v-else-if="order.status == 1">
        <van-icon
          :name="require('@/assets/images/order/status1@2x.png')"
          class="color-main"
          size="80"
        />
        <h3 class="color-main my-2">已完成</h3>
      </template>
      <template v-else>
        <van-icon
          :name="require('@/assets/images/order/status4@2x.png')"
          class="color-main"
          size="80"
        />
        <h3 class="color-main my-2">已取消</h3>
      </template>
      <p class="fs-12 color-light">
        确认提现后资产会在10分钟内到账，若为及时到账请联系平台客服
      </p>
    </div>

    <!-- 提现订单信息  -->
    <van-cell-group :border="false" class="mt-4">
      <van-cell center>
        <template #title>
          <span class="color-light">提现流水号</span>
        </template>
        <template #default>
          <span class="fs-12 fw-b">{{ order.orderNo }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light"
            >提现数量({{ $lance.filterBitType(order.bitType) }})</span
          >
        </template>
        <template #default>
          <span class="fs-12 color-main">{{ order.money }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light"
            >手续费({{ $lance.filterBitType(order.bitType) }})</span
          >
        </template>
        <template #default>
          <span class="fs-12 color-main">{{ order.fei || 0 }}</span>
        </template>
      </van-cell>
      <van-cell center>
        <template #title>
          <span class="color-light">实到金额(CNY)</span>
        </template>
        <template #default>
          <span class="fs-12 color-main">{{ actCny }}</span>
        </template>
      </van-cell>
      <template v-if="order.cardNo">
        <van-cell center>
          <template #title>
            <span class="color-light">收款方式</span>
          </template>
          <template #default>
            <span class="fs-12 fw-b">{{ order.bankName }}银行卡</span>
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">收款卡号</span>
          </template>
          <template #default>
            <span class="fs-12 fw-b">{{ order.cardNo }}</span>
          </template>
        </van-cell>
      </template>
      <template v-else>
        <van-cell center>
          <template #title>
            <span class="color-light">收款方式</span>
          </template>
          <template #default>
            <span class="fs-12 fw-b"
              >{{ $lance.filterBitType(order.bitType) }}钱包</span
            >
          </template>
        </van-cell>
        <van-cell center>
          <template #title>
            <span class="color-light">钱包地址</span>
          </template>
          <template #default>
            <span class="fs-12 fw-b">{{ order.walletAddress }}</span>
          </template>
        </van-cell>
      </template>
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
    <div class="footer-btn" v-if="showBtn">
      <van-button block type="info" to="center" replace> 完成 </van-button>
    </div>
  </div>
</template>
<script>
import Decimal from "decimal.js-light";
import $_ from "lodash";
export default {
  data() {
    return {
      order: {},
      orderNo: null,
      showBtn: true,
    };
  },
  computed: {
    actCny: function () {
      if (!$_.isEmpty(this.order)) {
        return Decimal(this.order.cnyTrans).mul(this.order.actMoney).toFixed(2);
      }
      return 0;
    },
  },
  mounted() {
    this.orderNo = this.$route.query.orderNo;
    this.showBtn = !!$_.toInteger(this.$route.query.showBtn);
    this.getWithdrawOrder();
  },
  methods: {
    /** 获取订单详情 */
    getWithdrawOrder() {
      this.$http.post(
        this.$apiUri.APP_WITHDRAW_ORDER_INFO,
        {
          orderNo: this.orderNo,
        },
        (res) => {
          this.order = res.data;
        }
      );
    },
  },
};
</script>
