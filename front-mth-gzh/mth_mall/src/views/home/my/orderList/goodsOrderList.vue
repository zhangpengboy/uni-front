<!-- 商城订单 -->
<template>
  <div class="order">
    <van-sticky offset-top="2.45334rem">
      <van-tabs
        v-model="active"
        @click="onClick"
        sticky
        color="#EB6133"
        title-active-color="#EB6133"
        title-inactive-color="#666"
      >
        <van-tab
          v-for="(item, index) in statusList"
          :key="index"
          :title="item"
        ></van-tab>
      </van-tabs>
    </van-sticky>
    <van-list
      v-if="dataOK || orderList.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getOrderList"
    >
      <div
        class="orderList main-wrap"
        v-for="(item, index) in orderList"
        :key="index"
      >
        <!-- <div class="orderList-title" @click="goStore(item.storeId)"> -->
        <div class="orderList-title">
          <div class="orderList-title-left">
            <van-image
              round
              width=" 0.64865rem"
              height=" 0.64865rem"
              :src="require('@/assets/images/logo.png')"
            />
            <!--  ? null : item.storeName -->
            <span class="orderList-title-left-name">{{
              item.saleStoreName ? item.saleStoreName : item.storeName
            }}</span>
          </div>
          <div class="text-main fs-14">{{ statusMap[item.status] }}</div>
        </div>
        <div class="orderList-text" @click="toOrderDetail(item)">
          <img class="orderList-text-img" :src="item.goodsSkuIcon" />
          <div class="orderList-text-right">
            <div class="orderList-text-right-name">{{ item.goodsName }}</div>
            <div class="orderList-text-right-SkuName">
              规格：{{ item.goodsSkuName }}
            </div>
            <div class="orderList-text-right-num">
              <!-- <span class="mr-10">运费：{{ `¥ ${item.postage}` }}</span> -->
              <span>数量：{{ `x ${item.goodsNum}` }}</span>
            </div>
            <div class="price text-price text-main">
              <span>{{ item.salePrice }}</span>
              <template v-if="item.integral > 0">
                <span class="text-xs">{{
                  item.integralType | filterIntegralType
                }}</span>
                <span>{{ item.integral }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
              <!-- <span class="text-marketPrice">{{ `¥ ${v.marketPrice}`}}</span> -->
            </div>
          </div>
        </div>
        <div class="orderList-price">
          <span class="type">{{
            item.status == 0 || item.status == 4 ? "应付款" : "实付款"
          }}</span>
          <div class="price text-price text-main">
            <span>{{ item.payAmount }}</span>
            <template v-if="item.integral > 0 && item.integralType === 0">
              <span class="text-xs">{{
                item.integralType | filterIntegralType
              }}</span>
              <span>{{ item.integral }}</span>
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </template>
          </div>
        </div>
        <div class="orderList-but">
          <van-button
            v-if="item.status == 4 || item.status == 5"
            color="#C1C1C1"
            plain
            round
            class="px-3 ml-3"
            size="small"
            @click.stop="delOrder(item)"
            >删除订单</van-button
          >

          <van-button
            v-if="item.status == 0"
            color="#C1C1C1"
            plain
            round
            class="px-3 ml-3"
            size="small"
            @click.stop="cancelOrder(item)"
            >取消订单</van-button
          >
          <van-button
            v-if="item.status == 0"
            color="#EB6133"
            plain
            round
            class="px-3 ml-3"
            size="small"
            @click.stop="toPayment(item)"
            >立即付款</van-button
          >

          <!-- <template v-if="item.status == 1">
                <van-button
                  color="#C1C1C1"
                  plain
                  round
                  class="px-3 ml-3"
                  size="small"
                  @click.stop="toOrderDetail(item)"
                  >申请退款</van-button>

                <van-button
                  color="#EB6133"
                  plain
                  round
                  class="px-3 ml-3"
                  size="small"
                  @click.stop="remindDeliver(item)"
                  >提醒发货</van-button
                > -->
          <!-- </template> -->
          <template v-if="item.status == 2">
            <!-- <van-button color="#C1C1C1" plain round class="px-3 ml-3" size="small" @click.stop="cancelOrder(item)">查看物流</van-button> -->
            <van-button
              color="#EB6133"
              plain
              round
              class="px-3 ml-3"
              size="small"
              @click.stop="confirmOrder(item)"
              >确认收货</van-button
            >
          </template>
        </div>
      </div>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_order@2x.png')"
      description="暂无订单"
    />
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name: 'goodsOrderList',
  data () {
    return {
      loading: false,
      finished: false,
      active: 0,
      orderList: [],
      activeParent: 0,
      statusParentList: ['商城订单', '店铺订单'],
      dataOK: true,
      statusList: ['全部', '待付款', '待发货', '待收货', '已完成', '退换货'],
      statusMap: {
        0: '待付款',
        1: '待发货',
        2: '待收货',
        3: '已完成',
        4: '已关闭',
        5: '无效订单',
        6: '已退款',
        7: '退款中'
      },
      queryParams: {
        status: '', // 订单状态 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单；6->已退款
        pageNum: 1,
        pageSize: 5
        // bsType: 'BS_A001'
      }
    }
  },
  created () {
    // console.info(this.$route.query.status,typeof this.$route.query.status)
    this.queryParams.status =
      typeof this.$route.query.status === 'undefined'
        ? ''
        : this.$route.query.status * 1
    this.active =
      this.$route.query.status === '6' ? 5 : this.$route.query.status * 1 + 1
    this.getOrderList()
  },
  methods: {
    // 返回的位置判断
    onClickLeft () {
      this.$router.push('my')
    },
    // 切换状态tabs
    onClick (name) {
      let code = null
      if (name === 0) {
        code = ''
      } else if (name === 5) {
        code = 6
      } else {
        code = name - 1
      }
      this.orderList = []
      this.finished = false
      this.dataOK = true
      this.queryParams = _.assign(
        {},
        {
          status: code,
          pageNum: 1,
          pageSize: 5
          // bsType: 'BS_A001'
        }
      )
      this.getOrderList()
    },
    // 获取用户订单列表
    getOrderList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_USERORDERLIST,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
          this.orderList = _.concat(this.orderList, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        err => {
          this.loading = false
          this.dataOK = true
          this.finished = true
          this.$toast(err.message)
        }
      )
    },
    // 跳转到店铺详情页
    goStore (id) {
      this.$router.push({
        path: '/storeData',
        query: {
          storeId: id
        }
      })
    },
    // 跳转到订单详情；申请退款跳转到订单详情
    toOrderDetail (row) {
      this.$router.push({
        path: '/orderDetail',
        query: {
          orderNo: row.orderNo
        }
      })
    },
    // 删除订单
    delOrder (item) {
      this.$dialog
        .confirm({
          message: '确定删除此订单？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_ORDER_DELETE,
            { orderNo: item.orderNo },
            res => {
              this.queryParams.pageNum = 1
              this.finished = false
              this.loading = false
              this.dataOK = true
              this.orderList = []
              this.getOrderList()
              Toast('删除成功')
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 取消订单
    cancelOrder (item) {
      this.$dialog
        .confirm({
          message: '确定取消此订单？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_USERORDERCANCEL,
            { orderNo: item.orderNo },
            res => {
              this.queryParams.pageNum = 1
              this.finished = false
              this.loading = false
              this.dataOK = true
              this.orderList = []
              this.getOrderList()
              Toast('取消成功')
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    },
    // 立即付款
    toPayment (item) {
      // this.$lance.setJson('aiipay_list', [item])
      // console.log(11,this.orderNo)
      // 跳支付页面之前判断礼券是否能抵扣
      // console.log(22,item);
      this.$http.post(this.$apiUri.APP_GRALGET, {}, res => {
        // console.log(12345, res)
        if (item.integralType === 0) {
          if (res.data.freeAmount < item.integral) {
            this.$toast('账号礼券不足')
            return
          }
        }
        this.$router.push({
          path: '/aiipay',
          query: {
            orderNo: item.orderNo,
            integralType: item.integralType
          }
        })
      })
    },
    // 提醒发货
    // remindDeliver (item) {
    //   this.$toast({
    //     type: 'success',
    //     message: '已提醒商家发货！'
    //   })
    // },
    // 确认收货
    confirmOrder (item) {
      this.$dialog
        .confirm({
          message: '是否确定收货？',
          // theme: 'round-button',
          showCancelButton: true
        })
        .then(() => {
          this.$http.post(
            this.$apiUri.APP_USERORDERCONFIRM,
            { orderNo: item.orderNo },
            res => {
              // this.$toast('确认成功')
              // Toast('确认成功')

              this.queryParams.pageNum = 1
              this.finished = false
              this.loading = false
              this.dataOK = true
              this.orderList = []
              this.getOrderList()
              Toast('确认成功')
            },
            err => {
              this.$toast(err.message)
            }
          )
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.orderList {
  margin-top: 12px;
  padding: 14px;
  // margin-bottom: 46px;
  .price {
    font-size: 16px;
    font-weight: 700;
  }
  /deep/ .van-image__img {
    border-radius: 4px;
  }
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    &-left {
      display: flex;
      align-items: center;

      &-name {
        width: 160px;
        margin-left: 10px;
        font-size: 15px;
        color: #333;
        font-weight: 700;
        display: inline-block;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
  }

  &-text {
    display: flex;
    &-img {
      width: 94px;
      height: 94px;
      border-radius: 4px;
    }
    &-right {
      margin-left: 12px;

      &-name {
        font-size: 14px;
        color: #333;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &-SkuName {
        font-size: 10px;
        border-radius: 5px;
        color: #666;
        margin: 5px 0 8px;
        display: -webkit-box;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }

      &-num {
        font-size: 13px;
        color: #999;
        margin-bottom: 8px;
      }
    }
  }

  &-price {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 14px 0;

    .type {
      font-size: 14px;
      color: #333;
      margin-right: 6px;
    }
  }

  &-but {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
