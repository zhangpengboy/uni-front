<!-- 订单管理-->
<template>
  <div class="order">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="center" v-for="(item, index) in data" :key="index">
      <div class="d-flex justify-content-between mb-3">
        <span class="fs-16 color-text fw-700">{{ item.name }}</span>
      </div>
      <div class="d-flex flex-row justify-content-around">
        <div
          v-for="(v, i) in item.count"
          :key="i"
          @click="toPage(item.name, v.status)"
        >
          <p class="fs-20 color-text fw-700 mt-2 text-center">{{ v.num }}</p>
          <p class="my-2">
            <span
              v-if="item.name === '商城订单'"
              class="fs-13 color-light pr-1"
              >{{ i | filterGoodsOrderlType }}</span
            >
            <span
              v-if="item.name === '街市订单'"
              class="fs-13 color-light pr-1"
              >{{ i | filterStoreOrderlType }}</span
            >
            <span
              v-if="item.name === '店铺订单'"
              class="fs-13 color-light pr-1"
              >{{ i | filterStoreOrderlType }}</span
            >
            <van-icon name="arrow" size="10" color="#999" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      data: [],
      storeId: '',
      orderClassify: ['商城订单', '街市订单', '店铺订单']
    }
  },
  created () {
    this.storeId = this.$lance.getData('storeId')
    // this.getGoodsCount()
  },
  activated () {
    this.getOrderCount()
  },
  methods: {
    // 获取订单统计
    getOrderCount () {
      this.data = []
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_COUNT,
        { storeId: this.storeId },
        (res) => {
          res.data.forEach((element, i) => {
            if (element) {
              this.data.push({
                name: this.orderClassify[i],
                count: [
                  { status: 0, num: element.notPayment },
                  { status: 1, num: element.notDeliverGoods },
                  { status: 3, num: element.complete },
                  { status: 6, num: element.reuturnGoods }
                ]
              })
            }
          })
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    },
    /* 前往指定url页面 */
    toPage (name, i) {
      if (name === '商城订单') {
        this.$router.push({
          path: 'mallOrderList',
          query: {
            status: i
          }
        })
      }
      if (name === '店铺订单') {
        this.$router.push({
          path: 'storeOrderList',
          query: {
            status: i
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.order {
  padding: 12px;
  .center {
    width: 100%;
    height: 128px;
    background: #ffffff;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    .add {
      width: 22px;
      height: 22px;
      background: #ffeee8;
      border-radius: 4px;
      line-height: 22px;
      text-align: center;
    }
  }
}
</style>
