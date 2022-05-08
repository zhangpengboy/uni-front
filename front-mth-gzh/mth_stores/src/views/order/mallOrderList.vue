<!-- 商城订单管理 -->
<template>
  <div class='order'>
    <!-- <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    /> -->
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    >
      <template #title>
        <form action="/">
          <van-search
            v-model="queryParams.goodsName"
            placeholder="搜索"
            shape="round"
            @search="onSearch"
            @clear="onClear"
          />
        </form>
      </template>
    </van-nav-bar>
    <van-sticky offset-top="1.22667rem">
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
      class="center"
    >
      <div
        class="card"
        v-for="(item, index) in orderList"
        :key="index"
      >
        <div @click="toOrderDetails(item)">
          <div class="d-flex justify-content-between">
            <span class="fs-14 color-text">订单编号：{{ item.orderNo }}</span>
            <span class="fs-14 color-main">{{ statusMap[item.status] }}</span>
          </div>
          <van-divider :style="{ margin: '12px 0' }"/>
          <div class="d-flex">
            <img class="goods-thumb" :src="item.goodsSkuIcon" alt="">
            <div class="goodsInfo">
              <p class="title">{{ item.goodsName }}</p>
              <p class="d-flex justify-content-between my-2">
                <span class="guige">{{ item.goodsSkuName }}</span>
                <span class="fs-13 color-light">{{ `x${item.goodsNum}` }}</span>
              </p>
              <div class="price text-price">
                <span>{{ item.salePrice }}</span>
                <template v-if="item.integral > 0">
                  <span class="text-xs">{{
                    item.integralType | filterIntegralType
                  }}</span>
                  <span>{{ item.integral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
                <span class="text-marketPrice">{{ `¥ ${item.marketPrice}` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
            <span class="fs-14 color-text">{{
              item.status == 0 || item.status == 4 ? '需付款' : '实付款'
            }}</span>
            <div class="price text-price fw-700">
              <span>{{ item.payAmount }}</span>
              <template v-if="item.integral > 0 && item.integralType === 0">
                <span class="text-xs">{{
                  item.integralType | filterIntegralType
                }}</span>
                <span>{{ item.integral }}</span>
                <span class="text-xs">{{ $lance.getIntegralName() }}</span>
              </template>
            </div>
            <van-button
              v-if="item.status === 0"
              color="#EB6133"
              plain
              round
              class="px-5 ml-1"
              size="mini"
              @click.stop="priceDialog(item)"
              >修改金额</van-button
            >
            <van-button
              v-if="item.status === 1"
              color="#EB6133"
              plain
              round
              class="px-5 ml-1"
              size="mini"
              @click.stop="shipmentsDialog(item)"
              >发货</van-button
            >
        </div>
      </div>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_order@2x.png')"
      description="暂无订单"
    />
    <!-- 修改金额弹框 -->
    <van-overlay :show="open" @click="open = false">
      <div class="wrapper" @click.stop>
        <div class="dialog">
        <div class="dialog-title">
          <p>修改订单金额</p>
          <van-icon name="cross" size="12" color="#D5D5D5" class="icon" @click="open = false"/>
        </div>
        <van-field v-model="salePrice" type="number" label="订单金额：" placeholder="请输入订单金额"/>
        <div class="dialog-but" @click="update">确认</div>
      </div>
      </div>
    </van-overlay>
    <!-- 发货弹框 -->
    <van-overlay :show="openShipments" @click="openShipments = false">
      <div class="wrapper" @click.stop>
        <div class="dialog">
        <div class="dialog-title">
          <p>发货</p>
          <van-icon name="cross" size="12" color="#D5D5D5" class="icon" @click="openShipments = false"/>
          </div>
          <van-cell title="物流公司" :value="deliveryName" is-link  @click="openDelivery=true"/>
          <van-field v-model="deliveryNo" label="物流单号" placeholder="请输入物流单号"/>
          <van-button
            color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
            block
            size="small"
            round
            @click="shipments"
            class="my-2 but"
            >确认</van-button
          >
        </div>
      </div>
    </van-overlay>
    <van-popup v-model="openDelivery" position="bottom" round closeable>
      <p class="fs-16 color-text text-center my-2">选择快递</p>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
          v-for="(item, i) in $lance.delivery()"
          :key="i"
          :title="item.key"
          clickable
          @click="radio = item.key">
            <template #right-icon>
              <van-radio :name="item.key" checked-color="#eb6133" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button
          color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
          block
          size="small"
          round
          @click="okDelivery"
          class="my-2 but"
          >确认</van-button
        >
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'mallOrderList',
  data () {
    return {
      loading: false,
      finished: false,
      active: 0,
      orderList: [],
      dataOK: true,
      open: false,
      salePrice: null,
      openShipments: false,
      deliveryName: null,
      deliveryNo: null,
      openDelivery: false,
      radio: null,
      orderAddress: null,
      orderNo: null,
      id: null,
      statusList: ['全部', '待付款', '待发货', '已发货', '已完成', '退换货'],
      statusMap: {
        0: '待付款',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭',
        5: '无效订单',
        6: '已退款',
        7: '退款中'
      },
      queryParams: {
        status: '', // 订单状态 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单；6->已退款
        pageNum: 1,
        pageSize: 10,
        storeId: '',
        bsType: 'BS_A001'
      }
    }
  },
  created () {
    this.queryParams.storeId = this.$lance.getData('storeId')
    if (this.$route.query.status) {
      this.active = this.$route.query.status * 1 + 1
      this.queryParams.status = this.$route.query.status * 1
    }
    if (this.$route.query.status === '6') {
      this.active = 5
      this.queryParams.status = this.$route.query.status * 1
    }
    this.getOrderList()
  },
  methods: {
    // 搜索
    onSearch () {
      this.reset()
      let code = null
      if (this.active === 0) {
        code = ''
      } else if (this.active === 5) {
        code = 6
      } else {
        code = this.active - 1
      }
      this.queryParams.status = code
      this.getOrderList()
    },
    // 清除搜索
    onClear () {
      this.reset()
      this.queryParams.goodsName = null
      this.onSearch()
    },
    // 重置
    reset () {
      this.orderList = []
      this.finished = false
      this.loading = false
      this.dataOK = true
      this.queryParams.pageNum = 1
    },
    // 切换tabs
    onClick (name) {
      this.active = name
      this.orderList = []
      this.finished = false
      this.loading = false
      this.dataOK = true
      let code = null
      if (name === 0) {
        code = ''
      } else if (name === 5) {
        code = 6
      } else {
        code = name - 1
      }
      this.queryParams = _.assign(
        {},
        {
          status: code,
          pageNum: 1,
          pageSize: 10,
          storeId: this.$lance.getData('storeId'),
          bsType: 'BS_A001'
        }
      )
      this.getOrderList()
    },
    // 获取订单列表
    getOrderList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_ORDER_LIST,
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
    // 获取退款订单列表
    getReturnApplyOrderList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_ORDER_RETURNAPPLY_LIST,
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
    // 跳转订单详情
    toOrderDetails (v) {
      this.$router.push({
        name: 'orderDetails',
        query: {
          orderNo: v.orderNo
        }
      })
    },
    // 打开修改金额的弹框
    priceDialog (v) {
      this.open = true
      this.id = v.id
    },
    // 打开发货的弹框
    shipmentsDialog (v) {
      this.openShipments = true
      this.orderNo = v.orderNo
      console.log(this.orderNo)
    },
    // 发货
    shipments () {
      /** 获取订单详情 */
      this.$http.post(
        this.$apiUri.APP_ORDER_DETAIL,
        {
          orderNo: this.orderNo
        },
        res => {
          this.orderAddress = res.data.omsOrderAddress
          const form = {
            orderNo: this.orderNo,
            deliveryNo: this.deliveryNo,
            deliveryName: this.deliveryName,
            contactTel: this.orderAddress.phone,
            contactPerson: this.orderAddress.userName,
            contactAddress: this.orderAddress.address
          }
          this.$http.post(
            this.$apiUri.APP_ORDER_DELIVERY_ADD,
            form,
            res => {
              this.$toast('发货成功')
              this.openShipments = false
              this.deliveryNo = null
              this.deliveryName = null
              this.reset()
              this.getOrderList()
            }, err => {
              this.$toast(err.message)
            }
          )
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    check (v) {
      var a = /^[0-9]*(\.[0-9]{1,2})?$/
      if (!a.test(v)) {
        return false
      } else {
        return true
      }
    },
    // 确认修改金额
    update () {
      if (!this.check(this.salePrice)) return this.$toast('请输入正确的金额')
      this.$http.post(
        this.$apiUri.APP_ORDERUPDATEAMOUNT,
        {
          amount: this.salePrice,
          id: this.id
        },
        res => {
          this.open = false
          this.$toast('订单金额修改成功')
          this.salePrice = null
          this.reset()
          this.getOrderList()
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 选择物流公司
    okDelivery () {
      this.deliveryName = this.radio
      this.openDelivery = false
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.order {
  .center {
    padding: 12px;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    .goods-thumb {
      width: 94px;
      height: 94px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .goodsInfo {
      min-width: 210px;
    }
    .title {
      font-size: 14px;
      color: #333;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .guige {
      // max-width: 120px;
      height: 20px;
      font-size: 10px;
      background: #F2F2F2;
      border-radius: 4px;
      color: #666;
      text-align: center;
      padding: 3px 6px;
    }
    .line {
      width: 1px;
      height: 14px;
      background: #EEEEEE;
      margin: 0 8px;
    }
    .copy {
      min-width: 20px;
      text-align: center;
      .copy-icon {
        width: 14px;
        height: 14px;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 14px;
      .act {
        min-width: 76px;
        height: 28px;
        font-size: 12px;
        color: #EB6133;
        background: #FFEEE8;
        border-radius: 0px 18px 18px 0px;
        line-height: 28px;
        text-align: center;
        margin-left: -14px;
        padding: 0 14px;
      }
    }
  }
  .van-overlay {
    z-index: 100;
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
}
</style>
