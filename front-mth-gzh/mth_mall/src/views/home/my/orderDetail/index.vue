<template>
  <div class="orderDetail">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      :border="false"
      placeholder
      @click-left="$router.back()"
    />
    <!-- 订单状态 -->
    <div class="orderStatus" v-if="applyStatus == null">
      <div>{{ status | filterOrderStatus }}</div>
      <van-image
        width="1.83784rem"
        height="1.83784rem"
        fit="contain"
        :src="imgList[status]"
      />
    </div>
    <div class="orderStatus" v-else>
      <div>{{ applyStatus | filterApplyStatus }}</div>
      <van-image
        width="1.83784rem"
        height="1.83784rem"
        fit="contain"
        :src="imgApplyList[applyStatus]"
      />
    </div>
    <template v-if="applyStatus == null">
      <div class="site" v-if="orderData && orderData.omsOrderAddress">
        <!-- 物流信息 -->
        <div class="delivery" v-if="orderData.omsOrderDelivery">
          <van-image
            width="0.64865rem"
            height="0.64865rem"
            fit="fill"
            :src="require('@/assets/images/orders/in_transit@2x.png')"
          />
          <div class="delivery-d">
            <p class="site-name">
              <span>物流公司：</span>
              <span class="userName mr-2">{{
                orderData.omsOrderDelivery.deliveryName
              }}</span>
            </p>
            <p class="site-name">
              <span>物流单号：</span>
              <span class="address">{{
                orderData.omsOrderDelivery.deliveryNo
              }}</span>
            </p>
          </div>
          <div
            class="delivery-copy"
            v-clipboard:copy="orderData.omsOrderDelivery.deliveryNo"
            v-clipboard:success="spanPasteNo"
          >
            <span class="delivery-copy-no">复制单号</span>
          </div>
        </div>
        <!-- 收货地址 -->
        <p class="site-name">
          <span>收货人：</span>
          <span class="userName mr-2">{{
            orderData.omsOrderAddress.userName
          }}</span>
          <span class="phone">{{ orderData.omsOrderAddress.phone }}</span>
        </p>
        <div class="site-address">
          <span class="key">收货地址：</span>
          <div class="address">{{ orderData.omsOrderAddress.address }}</div>
        </div>
      </div>
      <!-- 商品详情 -->
      <div class="detail" v-if="orderData && orderData.omsOrderDetail">
        <div class="goods">
          <img :src="orderData.omsOrderDetail.goodsSkuIcon" />
          <div class="goods-text">
            <div class="goods-text-title">
              {{ orderData.omsOrderDetail.goodsName }}
            </div>
            <div class="goods-text-num">
              <div class="goods-text-num-SKU">
                <span class="goodsSkuName">{{
                  `规格：${orderData.omsOrderDetail.goodsSkuName}`
                }}</span>
              </div>
              <span>{{ `x${orderData.omsOrderDetail.goodsNum}` }}</span>
            </div>
            <div class="price text-price">
              <span>{{ orderData.omsOrderDetail.salePrice }}</span>
              <template v-if="orderData.omsOrderDetail.integral > 0">
                <span class="text-xs">{{
                  orderData.omsOrderDetail.integralType | filterIntegralType
                }}</span>
                <span>{{ orderData.omsOrderDetail.integral }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
              <span class="text-marketPrice">{{
                `¥ ${orderData.omsOrderDetail.marketPrice}`
              }}</span>
            </div>
          </div>
        </div>

        <van-cell title="商品总额">
          <template #default>
            <div class="price text-price">
              <span>{{
                  allParice
              }}</span>
              <template v-if="orderData.omsOrderDetail.integral > 0">
                <span class="text-xs">{{
                  orderData.omsOrderDetail.integralType | filterIntegralType
                }}</span>
                <span>{{
                  orderData.omsOrderDetail.integral *
                    orderData.omsOrderDetail.goodsNum
                }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
            </div>
          </template>
        </van-cell>
        <van-cell title="优惠券">
          <template #default>
            <span class="text-main" v-if="orderData.deductionAmount > 0">{{
              `- ${orderData.deductionAmount}`
            }}</span>
            <span v-else>无</span>
          </template>
        </van-cell>
        <van-cell title="邮费">
          <template #default>
            <span v-if="orderData.omsOrder.postage > 0">{{
              `¥ ${orderData.omsOrder.postage}`
            }}</span>
            <span v-else>包邮</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span class="custom-title">{{
              status === 0 ? '应付款' : '实付款'
            }}</span>
          </template>
          <template #default>
            <div class="price text-price text-main">
              <span>{{ orderData.omsOrder.payAmount }}</span>
              <template
                v-if="
                  orderData.omsOrderDetail.integral > 0 &&
                    orderData.omsOrderDetail.integralType === 0
                "
              >
                <span class="text-xs">{{
                  orderData.omsOrderDetail.integralType | filterIntegralType
                }}</span>
                <span>{{
                  orderData.omsOrderDetail.integral *
                    orderData.omsOrderDetail.goodsNum
                }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
            </div>
          </template>
        </van-cell>
      </div>
      <!-- 订单详情 -->
      <div class="order" v-if="orderData && orderData.omsOrder">
        <div class="order-no">
          <div class="order-no-name">订单编号</div>
          <div class="order-no-value">
            <span class="span">{{ orderData.omsOrder.orderNo }}</span>
            <span
              class="copy"
              v-clipboard:copy="orderData.omsOrder.orderNo"
              v-clipboard:success="spanPaste"
              >复制</span
            >
          </div>
        </div>
        <van-cell title="下单时间">
          <template #default>
            <span>{{ $lance.parseTime(orderData.omsOrder.createTime) }}</span>
          </template>
        </van-cell>
        <van-cell title="发货时间" v-if="status === 2">
          <template #default>
            <span>{{
              $lance.parseTime(orderData.omsOrderDelivery.createTime)
            }}</span>
          </template>
        </van-cell>
        <van-cell title="发货时间" v-if="status === 3">
          <template #default>
            <span>{{
              $lance.parseTime(orderData.omsOrderDelivery.signInTime)
            }}</span>
          </template>
        </van-cell>
        <van-cell title="留言">
          <template #default>
            <p class="right">{{ orderData.omsOrder.note }}</p>
          </template>
        </van-cell>
      </div>
    </template>
    <!-- 退货 -->
    <template v-else>
      <!-- 拒绝退款 -->
      <div class="card-bg" v-if="applyStatus == 3">
        <div class="d-flex align-items-center">
          <van-icon name="warning-o" color="#f53232" size="24px"/>
          <span class="fs-14 color-muted3 ml-1">商家驳回退款申请</span>
        </div>
        <van-divider/>
        <p class="fs-14 color-muted3 mb-1">驳回原因：{{ returnData.handleNote }}</p>
        <p class="fs-13 color-light">{{ $lance.parseTime(returnData.handleTime) }}</p>
      </div>
      <!-- 退款成功 -->
      <div v-else class="card-bg d-flex justify-content-between align-items-center">
        <div class="fs-14 color-muted3">退款金额</div>
        <div class="price text-price text-main">{{ returnData.returnAmount }}</div>
      </div>
      <!-- 退货订单详情 -->
      <div class="detail pb-1">
        <p class="fs-14 color-muted3 fw-700 mb-2">退款信息</p>
        <div class="goods">
          <img :src="orderData.omsOrderDetail.goodsSkuIcon" />
          <div class="goods-text">
            <div class="goods-text-title">
              {{ orderData.omsOrderDetail.goodsName }}
            </div>
            <div class="goods-text-num">
              <div class="goods-text-num-SKU">
                <span class="goodsSkuName">{{
                  `规格：${orderData.omsOrderDetail.goodsSkuName}`
                }}</span>
              </div>
              <span>{{ `x${orderData.omsOrderDetail.goodsNum}` }}</span>
            </div>
            <div class="price text-price">
              <span>{{ orderData.omsOrderDetail.salePrice }}</span>
              <template v-if="orderData.omsOrderDetail.integral > 0">
                <span class="text-xs">{{
                  orderData.omsOrderDetail.integralType | filterIntegralType
                }}</span>
                <span>{{ orderData.omsOrderDetail.integral }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
              <span class="text-marketPrice">{{
                `¥ ${orderData.omsOrderDetail.marketPrice}`
              }}</span>
            </div>
          </div>
        </div>
        <p class="my-3">
          <span class="fs-13 color-light mr-3">退款原因</span>
          <span class="fs-13 color-muted3 reason">{{ returnData.reason }}</span>
        </p>
        <p class="my-3">
          <span class="fs-13 color-light mr-3">退款金额</span>
          <span class="fs-13 color-muted3">{{ returnData.returnAmount }}</span>
        </p>
        <p class="my-3">
          <span class="fs-13 color-light mr-3">申请时间</span>
          <span class="fs-13 color-muted3">{{ $lance.parseTime(returnData.createTime) }}</span>
        </p>
        <p class="my-3">
          <span class="fs-13 color-light mr-3">退款编号</span>
          <span class="fs-13 color-muted3">{{ returnData.applyOrderNo }}</span>
        </p>
      </div>
    </template>
    <!-- 底部按钮 -->
    <div
      class="footer"
      v-if="
        (status === 0 || status === 1 || status === 2) && applyStatus == null
      "
    >
      <van-button
        v-if="status === 0"
        color="#666"
        plain
        round
        size="small"
        @click="cancelOfOrder"
        class="px-3 ml-2"
        >取消订单</van-button
      >
      <van-button
        v-if="status === 0"
        color="#eb6133"
        plain
        round
        size="small"
        @click="toPayment"
        class="px-3 ml-2"
        >立即付款</van-button
      >
      <van-button
        v-if="status === 1"
        color="#666"
        plain
        round
        size="small"
        @click="showReasonFlag = true"
        class="px-3 ml-2"
        >申请退款</van-button
      >
      <!-- <van-button
        v-if="status === 1"
        color="#eb6133"
        plain
        round
        size="small"
        @click="remindDeliver"
        class="px-3 ml-2"
        >提醒发货</van-button
      > -->
      <van-button
        v-if="status === 2"
        color="#eb6133"
        plain
        round
        size="small"
        @click="confirmOrder"
        class="px-3 ml-2"
        >确认收货</van-button
      >
    </div>
    <!-- 退款申请的弹框 -->
    <van-dialog
      v-model="showReasonFlag"
      title="退款申请"
      show-cancel-button
      @confirm="refundGoodsOrder"
      @cancel="cancel"
    >
      <van-field
        class="px-2"
        v-model="reason"
        :autosize="{ maxHeight: 120, minHeight: 50 }"
        type="textarea"
        maxlength="80"
        show-word-limit
        placeholder="请输入退款申请理由"
      />
    </van-dialog>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
export default {
  filters: {
    filterPayType (type) {
      return ['未支付', '支付宝支付', '微信支付'][type]
    },
    // 订单状态过滤
    filterOrderStatus (status) {
      return [
        '待付款',
        '待发货',
        '待收货',
        '订单已完成',
        '交易关闭',
        '无效的订单',
        '已退款',
        '退款中'
      ][status]
    },
    filterApplyStatus (status) {
      return ['退款处理中', '商品退货中', '已退款', '拒绝退款'][status]
    }
  },
  data () {
    return {
      status: null, // 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单
      applyStatus: null, // 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝
      imgList: [
        require('@/assets/images/orders/pic_to_be_paid.png'), // 待付款
        require('@/assets/images/orders/pic_paid.png'), // 已付款，待发货
        require('@/assets/images/orders/pic_delivered.png'), // 已发货
        require('@/assets/images/orders/pic_transaction_completion.png'), // 已完成（交易成功）
        require('@/assets/images/orders/pic_transaction_closure.png'), // 已关闭
        require('@/assets/images/orders/pic_transaction_closure.png') // 已关闭,无效订单
      ],
      imgApplyList: [
        require('@/assets/images/orders/pic_pending.png'), // 待退款
        require('@/assets/images/orders/pic_delivered.png'), // 商品退货中
        require('@/assets/images/orders/pic_refund_complete.png'), // 已退款
        require('@/assets/images/orders/pic_transaction_closure.png') // 拒绝退款,关闭,无效订单
      ],
      orderNo: '',
      orderData: {},
      showReasonFlag: false,
      reason: '',
      allParice: null,
      returnData: {}
    }
  },
  mounted () {
    this.orderNo = this.$route.query.orderNo
    this.getGoodsOrderDetail()
  },
  methods: {
    // 获取订单信息
    getGoodsOrderDetail () {
      this.$http.post(
        this.$apiUri.APP_USERORDERDETAIL,
        { orderNo: this.orderNo },
        res => {
          // console.log(res.data)
          this.orderData = res.data
          this.status = res.data.omsOrder.status
          if (this.status === 7 || this.status === 6) {
            this.getRefundOrderDetail()
          }
          if (
            !_.isEmpty(this.orderData.omsOrderDetail) &&
            this.orderData.omsOrderDetail.salePrice != null &&
            this.orderData.omsOrderDetail.goodsNum != null
          ) {
            this.allParice = new Decimal(this.orderData.omsOrderDetail.salePrice)
              .mul(new Decimal(this.orderData.omsOrderDetail.goodsNum))
              .toFixed(2)
          } else {
            this.allParice = this.orderData.omsOrderDetail.salePrice * this.orderData.omsOrderDetail.goodsNum
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取退款申请信息
    getRefundOrderDetail () {
      this.$http.post(
        this.$apiUri.APP_RETURNAPPLYDETAIL,
        { orderNo: this.orderNo },
        res => {
          this.applyStatus = res.data.status
          // console.log(this.applyStatus)
          this.returnData = res.data
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    /* 申请退款 */
    refundGoodsOrder () {
      if (this.reason === '') {
        return this.$toast('请填写退款理由!')
      }
      this.$http.post(
        this.$apiUri.APP_RETURNAPPLY,
        {
          orderNo: this.orderNo,
          reason: this.reason
        },
        res => {
          this.$toast('退款申请成功!')
          this.showReasonFlag = false
          this.getGoodsOrderDetail()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 取消退款申请弹框
    cancel () {
      this.reason = ''
      this.showReasonFlag = false
    },
    // 取消订单
    cancelOfOrder () {
      this.$dialog
        .confirm({
          message: '确定取消此订单？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_USERORDERCANCEL,
            { orderNo: this.orderNo },
            res => {
              this.$toast('取消成功')
              this.getGoodsOrderDetail()
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 立即付款
    toPayment () {
      // this.$lance.setJson('aiipay_list', [this.orderData])
      this.$router.push({
        path: '/aiipay',
        query: {
          orderNo: this.orderNo
        }
      })
    },
    // 提醒发货
    remindDeliver () {
      this.$toast({
        type: 'success',
        message: '已提醒商家发货！'
      })
    },
    // 确认收货
    confirmOrder () {
      this.$dialog
        .confirm({
          message: '是否确定收货？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_USERORDERCONFIRM,
            { orderNo: this.orderNo },
            res => {
              this.$toast('确认成功')
              this.getGoodsOrderDetail()
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    spanPaste () {
      this.$toast('订单号已复制到剪切板')
    },
    spanPasteNo () {
      this.$toast('物流单号已复制到剪切板')
    }
  }
}
</script>

<style lang="scss" scoped>
// .textare {
//   width: 300px;
//   word-wrap: break-word;
//   word-break: break-all;
//   overflow: hidden;
// }
.orderDetail {
  height: 100%;
  // background: linear-gradient(360deg, #f1722c 0%, #eb6133 100%);
  // background: #eb6133;

  .van-nav-bar__placeholder {
    /deep/ .van-nav-bar {
      // background-color: #fff0 !important;
      background: #eb6133;
      .van-icon {
        color: #fff !important;
      }
      .van-nav-bar__title {
        color: #fff !important;
      }
    }
  }
  /deep/ .van-cell {
    padding: 8px 0;
    .van-cell__title {
      font-size: 13px;
      color: #999;
    }
    .van-cell__value {
      font-size: 13px;
      color: #333;
    }
  }
  /deep/ .van-cell::after {
    right: 0;
    bottom: 0;
    left: 0;
  }
  .orderStatus {
    width: 100%;
    height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    background: #eb6133;
    color: #fff;
    padding: 0 14px 0 36px;
  }
  .site {
    margin: 12px 12px 0 12px;
    background: #fff;
    border-radius: 8px;
    padding: 14px;
    .delivery {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid #ebedf0;
      // &-d {
      //   // margin-left: 12px;
      // }
      &-copy {
        // margin-left: 20px;
        &-no {
          font-size: 12px;
          padding: 3px 6px;
          border-radius: 4px;
          background-color: #eb6132;
          color: #ffffff;
        }
      }
    }
    &-name {
      // height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;
    }
    &-address {
      display: flex;
      // height: 18px;
      line-height: 18px;
      font-size: 12px;
      color: #333;
      // .key {
      //   width: 65px;
      // }
      .address {
        width: 260px;
        /* 这两个在技术上是一样的, 为了兼容了浏览器两个都加上 */
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        /* 这个的使用在web-kit中有些危险，他可能会阶段所有东西 */
        word-break: break-all;
        /* Instead use this non-standard one: */
        word-break: break-word;
        /* 如果浏览器支持的话增加一个连接符(Blink不支持) */
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
      }
    }
  }
  .detail {
    margin: 12px 12px 0 12px;
    background: #fff;
    border-radius: 8px;
    padding: 14px 14px 0 14px;
    .reason {
      /* 这两个在技术上是一样的, 为了兼容了浏览器两个都加上 */
      overflow-wrap: break-word;
      word-wrap: break-word;
      -ms-word-break: break-all;
      /* 这个的使用在web-kit中有些危险，他可能会阶段所有东西 */
      word-break: break-all;
      /* Instead use this non-standard one: */
      word-break: break-word;
      /* 如果浏览器支持的话增加一个连接符(Blink不支持) */
      -ms-hyphens: auto;
      -moz-hyphens: auto;
      -webkit-hyphens: auto;
      hyphens: auto;
    }
    .goods {
      display: flex;
      img {
        width: 94px;
        height: 94px;
        border-radius: 4px;
      }
      &-text {
        margin-left: 12px;
        &-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        &-num {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          &-SKU {
            height: 20px;
            background: #f2f2f2;
            border-radius: 4px;
            padding: 0 6px;
            .goodsSkuName {
              max-width: 180px;
              font-size: 10px;
              line-height: 20px;
              color: #666;
              display: inline-block;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }
          }
        }
      }
    }
    .custom-title {
      color: #333;
    }
  }
  .order {
    margin: 12px 12px 72px 12px;
    background: #fff;
    border-radius: 8px;
    padding: 0 14px 0 14px;
    &-no {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      // padding-bottom: 8px;
      border-bottom: 1px solid #ebedf0;
      &-name {
        color: #999;
      }
      &-vlaue {
        color: #333;
      }
      .span {
        padding-right: 4px;
      }
      .copy {
        color: #eb6133;
      }
    }
    .right {
      font-size: 13px;
      color: #333;
      text-align: left;
    }
  }

  // 退货
  .card-bg {
    margin: 12px 12px 0 12px;
    background: #fff;
    border-radius: 8px;
    padding: 14px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 10px;
    background-color: #fff;
  }
}
</style>
