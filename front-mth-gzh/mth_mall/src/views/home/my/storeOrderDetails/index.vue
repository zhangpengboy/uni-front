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
    <!-- 核销码 -->
    <div class="site d-flex flex-column align-items-center" v-if="orderData.length > 0 && orderData[0].status === 1 && orderData[0].receivingWay === 1">
      <div class="loadedCode">
        <span class="fs-13 color-light userName">核销码：</span>
        <span class="fs-13 color-text fw-700">{{ orderData[0].loadedCode }}</span>
      </div>
      <!-- <div class="mt-2 mb-4">
        <img src="" alt="">
      </div> -->
      <div class="qrcode mt-2 mb-4" ref="qrCodeUrl"></div>
      <div class="but" @click="shipmentsDialog('核销')">自主核销</div>
    </div>
    <!-- 订单信息 -->
    <div class="site" v-if="orderData.length > 0">
      <!-- 待核销 / 到店自取-->
      <div v-if="(orderData[0].status === 1 || orderData[0].status === 3) && orderData[0].receivingWay === 1">
        <div v-if="orderData[0].status === 3">
          <span class="fs-13 color-light userName">核销码：</span>
          <span class="fs-13 color-text fw-700">{{ orderData[0].loadedCode }}</span>
        </div>
        <div class="my-3" v-if="orderData[0].status === 1">
          <span class="fs-13 color-light">自取时间：</span>
          <span class="fs-13 color-text">{{ $lance.parseTime(orderData[0].createTime + 60*60*1000, '{y}-{m}-{d} {h}:{i}') }}</span>
        </div>
        <div class="my-3">
          <span class="fs-13 color-light userName">取货人：</span>
          <span class="fs-13 color-text">{{ orderData[0].userName }}</span>
        </div>
        <div>
          <span class="fs-13 color-light">预留手机：</span>
          <span class="fs-13 color-text">{{ orderData[0].userPhone }}</span>
        </div>
      </div>
      <!-- 配送信息 -->
      <div v-else>
        <div>
          <span class="fs-13 color-light">期望时间：</span>
          <span class="fs-13 color-text">{{ $lance.parseTime(orderData[0].createTime + 60*60*1000) }}</span>
        </div>
        <div class="d-flex my-3">
          <span class="fs-13 color-light">配送地址：</span>
          <div class="fs-13 color-text address">{{ orderData[0].address }}</div>
        </div>
        <div class="my-3">
          <span class="fs-13 color-light userName">联系人：</span>
          <span class="fs-13 color-text mr-1">{{
            orderData[0].userName
          }}</span>
          <span class="fs-13 color-text">{{ orderData[0].userPhone | filterPhone  }}</span>
        </div>
        <div>
          <span class="fs-13 color-light">配送服务：</span>
          <span class="fs-13 color-text">{{ receivingWay | filterReceivingWay }}</span>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <template  v-if="applyStatus == null">
    <div class="detail" v-if="orderData.length > 0">
      <div class="mb-2" v-for="(item, i) in orderData" :key="i">
        <div class="goods">
          <img :src="item.goodsImg" />
          <div class="goods-text">
            <div class="goods-text-title">
              {{ item.goodsName }}
            </div>
            <div class="goods-text-num">
              <span class="fs-13 color-light">{{ `x${item.goodsNum}` }}</span>
            </div>
            <div class="price text-price">
              <span class="fw-700">{{ item.salePrice }}</span>
              <template v-if="item.integral > 0">
                <span class="text-xs">{{
                  item.integralType | filterIntegralType
                }}</span>
                <span class="fw-700">{{ item.integral }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
              <span class="text-marketPrice">{{
                `¥ ${item.marketPrice}`
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <van-cell title="商品总额">
        <template #default>
          <div class="price text-price">
            <span class="fw-700">{{ allParice }}</span>
            <template v-if="allIntegral < 0">
              <span class="text-xs">+</span>
              <span class="fw-700">{{ allIntegral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
            <template v-if="allIntegral > 0">
              <span class="text-xs">送</span>
              <span class="fw-700">{{ allIntegral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
          </div>
        </template>
      </van-cell>
      <van-cell title="优惠">
        <template #default>
          <span v-if="deductionAmount > 0" class="text-main">-</span>
          <span v-if="deductionAmount < 0" class="text-main">+</span>
          <span class="text-xs text-main"> ¥</span>
          <span class="text-main">{{
            `${Math.abs(deductionAmount)}`
          }}</span>
        </template>
      </van-cell>
      <van-cell title="配送费">
        <template #default>
          <span class="text-xs">¥</span>
          <span>{{
            `${orderData[0].postage}`
          }}</span>
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          <span class="custom-title">{{
            status === 0 || status === 4 ? '需付款' : '实付款'
          }}</span>
        </template>
        <template #default>
          <div class="price text-price text-main">
            <span class="fw-700">{{ payAmount }}</span>
            <template v-if="allIntegral < 0">
              <span class="text-xs">+</span>
              <span class="fw-700">{{ allIntegral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
          </div>
        </template>
      </van-cell>
    </div>
    </template>
    <!-- 退货 -->
    <template v-else>
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
          <span
            class="fs-13 text-main ml-1"
            v-clipboard:copy="returnData.applyOrderNo"
            v-clipboard:success="spanReturnPaste"
            >复制</span
          >
        </p>
      </div>
    </template>
    <!-- 订单详情 -->
    <div class="order" v-if="orderData.length > 0">
      <div class="order-no">
        <div class="order-no-name">订单编号</div>
        <div class="order-no-value">
          <span class="span">{{ orderData[0].orderParent }}</span>
          <span
            class="copy"
            v-clipboard:copy="orderData[0].orderParent "
            v-clipboard:success="spanPaste"
            >复制</span
          >
        </div>
      </div>
      <van-cell title="下单时间">
        <template #default>
          <span>{{ $lance.parseTime(orderData[0].createTime) }}</span>
        </template>
      </van-cell>
      <van-cell title="核销时间" v-if="orderData[0].status === 2 || orderData[0].status === 3">
        <template #default>
          <span>{{
            $lance.parseTime(orderData[0].codeModifiedTime)
          }}</span>
        </template>
      </van-cell>
      <van-cell title="支付方式" v-if="orderData[0].status !== 0">
        <template #default>
          <span>在线支付</span>
        </template>
      </van-cell>
      <van-cell title="留言">
        <template #default>
          <p class="right">{{ orderData[0].note }}</p>
        </template>
      </van-cell>
    </div>

    <!-- 底部按钮 -->
    <div
      class="footer"
      v-if="
        ( orderData.length > 0 ) &&
        (orderData[0].status === 0 || (orderData[0].status === 1 && orderData[0].receivingWay === 0) || orderData[0].status === 4 || orderData[0].status === 5)
      "
    >
      <van-button
        v-if="orderData[0].status == 4 || orderData[0].status == 5"
        color="#C1C1C1"
        plain
        round
        class="px-3 ml-3"
        size="small"
        @click.stop="delOrder()"
        >删除订单</van-button
      >

      <van-button
        v-if="orderData[0].status == 0"
        color="#C1C1C1"
        plain
        round
        class="px-3 ml-3"
        size="small"
        @click.stop="cancelOrder()"
        >取消订单</van-button
      >
       <van-button
        v-if="orderData[0].status === 0"
        color="#EB6133"
        plain
        round
        class="px-3 ml-3"
        size="small"
        @click.stop="toPath('/storeGoodsPay')"
        >立即支付</van-button
      >
      <van-button
        v-if="orderData[0].status === 1 && orderData[0].receivingWay === 0"
        color="#EB6133"
        plain
        round
        class="px-3 ml-3"
        size="small"
        @click.stop="shipmentsDialog('送达')"
        >确认送达</van-button
      >
    </div>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import QRCode from 'qrcodejs2'
export default {
  filters: {
    // 订单状态过滤
    filterOrderStatus (status) {
      return [
        '待付款',
        '进行中',
        '已核销',
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
      parentNo: '',
      orderData: [],
      showReasonFlag: false,
      reason: '',
      allParice: 0, // 合计商品总价格
      allIntegral: 0, // 合计礼券数量
      payAmount: 0, // 合计支付金额
      open: false,
      salePrice: null,
      openShipments: false,
      deliveryName: null,
      deliveryNo: null,
      openDelivery: false,
      radio: null,
      orderAddress: null,
      returnData: {},
      receivingWay: 0 // 0-商家配送，1-到店自取
    }
  },
  computed: {
    deductionAmount: function () {
      if (this.orderData.length > 0) {
        let allNum = 0
        this.orderData.forEach(e => {
          if (e.salePrice !== null && e.goodsNum !== null && e.payAmount !== null) {
            allNum = new Decimal(allNum).add(new Decimal(e.salePrice).mul(new Decimal(e.goodsNum))).sub(new Decimal(e.payAmount))
          }
        })
        return allNum
      }
      return 0
    }
  },
  created () {
    this.parentNo = this.$route.query.parentNo
    this.getGoodsOrderDetail()
  },
  updated () {
    if (this.orderData.length > 0 && this.orderData[0].status === 1 && this.orderData[0].receivingWay === 1) {
      this.creatQrCode()
    }
    // this.$nextTick(() => {
    //   this.creatQrCode()
    // })
  },
  methods: {
    // 获取订单信息
    getGoodsOrderDetail () {
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_DETAIL,
        { parentNo: this.parentNo },
        res => {
          // console.log(res.data)
          if (res.data.length === 0) return
          this.orderData = res.data
          this.status = res.data[0].status
          this.receivingWay = res.data[0].receivingWay
          if (this.status === 7 || this.status === 6) {
            this.getRefundOrderDetail()
          }
          this.orderData.forEach(e => {
            if (e.salePrice !== null && e.goodsNum !== null && e.payAmount !== null) {
              this.allParice = new Decimal(this.allParice).add(new Decimal(e.salePrice).mul(new Decimal(e.goodsNum)))
              this.payAmount = new Decimal(this.payAmount).add(new Decimal(e.payAmount))
              if (e.integralType === 1) {
                this.allIntegral = new Decimal(this.allIntegral).add(new Decimal(e.integral))
              } else {
                this.allIntegral = new Decimal(this.allIntegral).sub(new Decimal(e.integral))
              }
            } else {
              this.allParice = 0
              this.allIntegral = 0
              this.payAmount = 0
            }
          })
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 跳支付页面
    toPath (name) {
      this.$router.push({
        path: name,
        query: {
          parentNo: this.orderData[0].orderParent
        }
      })
    },
    // 打开确认送达的弹框
    shipmentsDialog (v) {
      let url
      if (v === '送达') url = this.$apiUri.APP_STORE_ORDER_CONFIM
      if (v === '核销') url = this.$apiUri.APP_STORE_ORDER_VERIFICATION
      let _this = this
      _this.$dialog.confirm({
        title: '',
        message: `是否确认${v}商品？`,
        confirmButtonText: '是',
        cancelButtonText: '否'
      })
        .then(() => {
          _this.$http.post(
            url,
            {
              parentNo: this.parentNo
              // status: 2
            },
            () => {
              _this.$toast(`已确认${v}`)
              this.getGoodsOrderDetail()
            }, err => {
              _this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 确认修改金额
    update () {
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_UPDATE_AMOUNT,
        {
          amount: this.salePrice,
          parentNo: this.parentNo
        },
        res => {
          this.open = false
          this.$toast('订单金额修改成功')
          this.salePrice = null
          this.getGoodsOrderDetail()
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 生成二维码
    creatQrCode () {
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.parentNo, // 需要转换为二维码的内容
        width: 176,
        height: 176,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log(qrcode)
    },
    // 删除订单
    delOrder () {
      let _this = this
      this.$dialog
        .confirm({
          message: '确定删除此订单？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_STORE_ORDER_DEL,
            { parentNo: this.parentNo },
            res => {
              _this.getGoodsOrderDetail()
              this.$toast('删除成功')
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 取消订单
    cancelOrder () {
      let _this = this
      this.$dialog
        .confirm({
          message: '确定取消此订单？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_STORE_ORDER_CANCEL,
            { parentNo: this.parentNo },
            res => {
              _this.getGoodsOrderDetail()
              this.$toast('取消成功')
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 获取退款申请信息
    getRefundOrderDetail () {
      this.$http.post(
        this.$apiUri.APP_ORDER_RETURNAPPLY_DETAIL,
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
    /* 申请退款驳回 */
    refundGoodsOrder () {
      if (this.reason === '') {
        return this.$toast('请填写驳回原因!')
      }
      this.$http.post(
        this.$apiUri.APP_ORDER_RETURNAPPLY_REJECT,
        {
          orderNo: this.orderNo,
          note: this.reason
        },
        res => {
          this.$toast('驳回申请成功!')
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
    // 同意退款
    returnApplyOK () {
      this.$dialog
        .confirm({
          message: '确定同意退款？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_ORDER_RETURNAPPLY_CONFIRM,
            { orderNo: this.orderNo },
            res => {
              this.$toast('退款成功')
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
    spanReturnPaste () {
      this.$toast('退款编号已复制到剪切板')
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
    .userName {
      margin-left: 13px;
    }
    .address {
      width: 250px;
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
    .loadedCode {
      min-width: 150px;
      margin: 0 auto;
    }
    img {
      width: 176px;
      height: 176px;
      margin: 0 auto;
    }
    .but {
      width: 80px;
      height: 28px;
      font-size: 14px;
      background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
      line-height: 28px;
      text-align: center;
      border-radius: 35px;
      margin: 0 auto;
      color: #fff;
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
      text-align: right;
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .dialog {
      width: 300px;
      height: 210px;
      padding: 24px 14px 16px 14px;
      background: #fff;
      border-radius: 8px;

      &-title {
        p {
          height: 22px;
          font-size: 16px;
          font-weight: 300;
          line-height: 16px;
          text-align: center;
          color: #333333;
        }
        .icon {
          position: relative;
          top: -32px;
          left: 260px;
        }
      }

      &-but {
        width: 262px;
        height: 38px;
        font-size: 16px;
        background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
        border-radius: 19px;
        margin: 16px auto;
        line-height: 38px;
        text-align: center;
        color: #fff;
      }
    }
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
