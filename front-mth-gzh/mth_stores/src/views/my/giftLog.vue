<!-- 礼券明细 -->
<template>
  <div class='giftLog'>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-radio-group class="radio" v-model="queryParams.orderType" direction="horizontal" @change="onChange">
        <van-radio name="order" checked-color="#eb6133">商城订单</van-radio>
        <van-radio name="storeOrder" checked-color="#eb6133">便利店订单</van-radio>
      </van-radio-group>
      <van-field
        readonly
        clickable
        name="startDatetimePicker"
        :value="startTime"
        label="开始时间"
        placeholder="点击选择时间"
        @click="showStartPicker = true"
      />
      <van-popup v-model="showStartPicker" position="bottom">
        <van-datetime-picker
          v-model="currentStartDate"
          type="datetime"
          title="开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirmStart"
          @cancel="showStartPicker = false"
        />
      </van-popup>
      <van-field
        readonly
        clickable
        name="endDatetimePicker"
        :value="endTime"
        label="结束时间"
        placeholder="点击选择时间"
        @click="showEndPicker = true"
      />
      <van-popup v-model="showEndPicker" position="bottom">
        <van-datetime-picker
          v-model="currentEndDate"
          type="datetime"
          title="结束时间"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirmEnd"
          @cancel="showEndPicker = false"
        />
      </van-popup>
      <van-button
        color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
        block
        size="small"
        round
        @click="getList"
        class="my-2 but"
        >查询</van-button
      >
      <!-- 列表 -->
      <van-list
        v-if="dataOK || list.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="getList"
      >
        <div class="list-box" v-for="(item, index) in list" :key="index">
          <div>
            <p class="fs-14 color-text fw-700 mb-2">{{ item.userPhone }}</p>
            <p class="fs-13 color-muted ">{{ $lance.parseTime(item.createTime) }}</p>
          </div>
          <div class="text-right">
            <p  class="fs-14 color-main fw-700 text-price">{{ item.payAmount }}</p>
            <p class="fs-14 color-text fw-700" v-if="item.bsType === 'BS_A001'">
              {{ item.integralType == 0 ? `+${item.integral * item.goodsNum}` : `-${item.integral * item.goodsNum}` }}
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </p>
            <p class="fs-14 color-text fw-700" v-else>
              {{ item.integralType == 0 ? `+${item.integral}` : `-${item.integral}` }}
              <span class="text-xs">{{ $lance.getIntegralName() }}</span>
            </p>
          </div>
        </div>
      </van-list>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/empty/no_discount@2x.png')"
        description="暂无记录"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'giftLog',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      dataOK: true,
      showStartPicker: false,
      showEndPicker: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2030, 10, 1),
      currentStartDate: new Date(),
      currentEndDate: new Date(),
      startTime: null,
      endTime: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        storeId: '',
        // bsType: 'BS_A001',
        status: 3,
        orderType: 'order'
      }
    }
  },
  created () {
    // this.queryParams.startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000).getTime()
    // this.queryParams.endTime = new Date().getTime()
    this.queryParams.startTime = this.$lance.parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000).getTime())
    this.queryParams.endTime = this.$lance.parseTime(new Date().getTime())
    this.startTime = this.$lance.parseTime(this.queryParams.startTime)
    this.endTime = this.$lance.parseTime(this.queryParams.endTime)
    this.currentStartDate = new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000)
    this.getList()
  },
  methods: {
    getList () {
      this.isLoading = false
      this.dataOK = true
      this.list = []
      this.finished = false
      this.queryParams.pageNum = 1
      this.queryParams.storeId = this.$lance.getData('storeId')
      this.loading = true
      this.finished = false
      this.$http.post(
        this.$apiUri.APP_COUPON_DETAILS,
        this.queryParams,
        res => {
          if (this.finished) return
          let orderList = {}
          if (res.data.orders) {
            orderList = res.data.orders
          }
          if (res.data.streetOrders) {
            orderList = res.data.streetOrders
          }
          this.list = _.concat(this.list, orderList.list)
          this.loading = false
          this.dataOK = false
          if (
            orderList.totalPage === 0 ||
            orderList.totalPage === this.queryParams.pageNum
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
          this.isLoading = false
          this.$toast(err.message)
        })
    },
    onChange () {
      this.isLoading = false
      this.list = []
      this.dataOK = true
      this.finished = false
      this.queryParams.pageNum = 1
      this.queryParams.startTime = this.$lance.parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000).getTime())
      this.queryParams.endTime = this.$lance.parseTime(new Date().getTime())
      this.startTime = this.$lance.parseTime(this.queryParams.startTime)
      this.endTime = this.$lance.parseTime(this.queryParams.endTime)
      this.currentStartDate = new Date(new Date(new Date().toLocaleDateString()).getTime() - 7 * 24 * 3600 * 1000)
      this.getList()
    },
    onConfirmStart (time) {
      this.queryParams.startTime = this.$lance.parseTime(time.getTime())
      this.startTime = this.$lance.parseTime(time)
      this.showStartPicker = false
    },
    onConfirmEnd (time) {
      this.queryParams.endTime = this.$lance.parseTime(time.getTime())
      this.endTime = this.$lance.parseTime(time)
      this.showEndPicker = false
    },
    onRefresh () {
      this.isLoading = false
      this.list = []
      this.finished = false
      this.queryParams.pageNum = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getList()
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.list-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
  padding: 5px 12px;
}
.radio {
  background: #fff;
  padding: 14px;
}
</style>
