<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-25 18:00:32
 * @Description : 订单列表
-->
<template>
  <div class="order">
    <div class="orderList">
      <van-sticky :z-index="2000">
        <div class="orderList-title color-light">
          <span
            v-for="(title, index) in listTitle"
            :key="index"
            :class="active === index ? 'active' : ''"
            @click="onClickTabbar(index)"
            >{{ title }}</span
          >
        </div>
      </van-sticky>
      <!-- 全部订单 -->
      <div class="mt-2" v-if="_.size(list) > 0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="——我是有底线的——"
          :immediate-check="false"
          @load="getOrderlist"
        >
          <div
            class="orderList-card main-wrap"
            v-for="(item, index) in list"
            :key="index"
          >
            <router-link
              tag="div"
              :to="{
                path: 'orderInfo',
                query: { orderNo: item.orderNo },
              }"
              class="main-wrap-cont"
            >
              <div class="orderList-card-title">
                <div class="fs-14">
                  <span>订单号</span>
                  <span>{{ item.orderNo }}</span>
                </div>
                <span class="status">{{ statusMap[item.status] }}</span>
              </div>
              <div class="orderList-card-content">
                <div class="orderList-card-content_image">
                  <van-image
                    :src="item.productPic"
                    fit="cover"
                    lazy-load
                  >
                    <!-- <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template> -->
                  </van-image>

                </div>
                <div class="orderList-card-content_detail">
                  <div class="pt-1">
                    <div class="goods-title">{{ item.productName }}</div>
                    <div class="goods-num">
                      <span class="fs-11">x</span>
                      <span>{{ item.num }}</span>
                    </div>
                  </div>
                  <div class="fs-13 color-light pb-1">
                    <span>下单日:</span>
                    <span>{{ $lance.parseTime(item.createTime) }}</span>
                  </div>
                  <div class="fs-13 color-light">
                    <span>挖矿开始时间:</span>
                    <span>{{ $lance.parseTime(item.dayStart) }}</span>
                  </div>
                  <div class="fs-13 color-light">
                    <span>挖矿结束时间:</span>
                    <span>{{ $lance.parseTime(item.dayEnd) }}</span>
                  </div>
                </div>
              </div>
              <div class="orderList-card-btns" v-if="item.status == 0">
                <span class="btn" @click.stop="cancelOrder(item.orderNo)">
                  取消订单
                </span>
                <span class="btn main" @click.stop="toPayment(item.orderNo)">
                  立即支付
                </span>
              </div>
            </router-link>
          </div>
        </van-list>
      </div>
      <div v-else class="text-center color-light my-4 py-4">
        <van-icon
          :name="require('@/assets/images/order/order-empty@2x.png')"
          size="80"
          class="pr-3"
        ></van-icon>
        <p class="fs-14">暂无记录</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 1,
      listTitle: ['待支付', '生效中', '已终止'],
      statusMap: {
        0: '待支付',
        1: '生效中',
        3: '已完成',
        4: '已关闭'
      },
      listStatus: ['0', '1', '3'],
      orderData: {},
      list: [],
      imageObj: {},
      finished: false,
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bitType: 1,
        status: '' // 订单状态 0->待支付；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单；6->已退款
      }
    }
  },

  methods: {
    /** 切换订单状态 */
    onClickTabbar (index) {
      this.active = index
      this.init()
    },
    init () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        status: this.listStatus[this.active]
      }
      this.loading = true
      this.finished = false
      this.list = []
      this.getOrderlist()
    },
    /** 获取订单列表 */
    getOrderlist () {
      this.loading = true
      this.$http.post(this.$apiUri.APP_PORDER_LIST, this.queryParams, (res) => {
        if (this.finished) return
        this.list = _.concat(this.list, res.data.list)
        this.loading = false
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === this.queryParams.pageNum
        ) {
          this.finished = true
          return
        }
        this.queryParams.pageNum++
      })
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
    /** 支付订单 */
    toPayment (orderNo) {
      this.$http.post(this.$apiUri.APP_STORE_ORDER_INFO, { orderNo }, (res) => {
        this.$lance.setJson('pay-order', [res.data])
        this.$router.push('payment')
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
