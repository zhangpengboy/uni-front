<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 提现记录
-->

<template>
  <div class="center">
    <van-tabs v-model="active">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="处理中" name="0"></van-tab>
      <van-tab title="已完成" name="1"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>

    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
      class="mt-2"
      @load="getWithdrawList()"
    >
      <div
        class="main-wrap"
        v-for="(v, i) in list"
        :key="i"
        @click="toWithdrawStatus(v)"
      >
        <van-cell class="fs-12">
          <template #default>
            <span :class="v.status === 4 ? 'color-red' : 'color-main'">{{
              v.status | filterWithdrawStatus
            }}</span>
          </template>
          <template #title>
            <span class="color-light">{{
              $lance.parseTime(v.createTime)
            }}</span>
          </template>
        </van-cell>
        <div class="main-wrap-cont d-flex">
          <div class="w-50">
            <p class="fs-12">{{ v.bitType | filterBitType }}转出</p>
            <h2 class="fw-b mt-2">
              <span class="fs-12">&yen;</span>
              <span class="fs-20">{{ v.actCny }}</span>
            </h2>
          </div>
          <div class="w-50">
            <p
              class="d-flex justify-content-between align-items-center mb-2 fs-12 van-ellipsis"
            >
              <span class="color-light">单价</span>
              <span>{{ v.cnyTrans }} CNY</span>
            </p>
            <p
              class="d-flex justify-content-between align-items-center fs-12 van-ellipsis"
            >
              <span class="color-light">数量</span>
              <span>{{ v.money }} {{ v.bitType | filterBitType }}</span>
            </p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import Decimal from 'decimal.js-light'
export default {
  data () {
    return {
      active: '',
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        status: null, // 0->待审核；1->已完成；4->审核失败
        pageNum: 1,
        pageSize: 5,
        drawType: 1
      }
    }
  },
  watch: {
    active: function (newV) {
      this.list = []
      this.finished = false
      this.queryParams = _.assign(
        {},
        {
          status: newV, // 0->待审核；1->已完成；4->审核失败
          pageNum: 1,
          pageSize: 5,
          drawType: 1
        }
      )
      this.getWithdrawList()
    }
  },
  mounted () {
    // this.orderNo = this.$route.query.orderNo;
    this.getWithdrawList()
  },
  methods: {
    /** 获取订单详情 */
    getWithdrawList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_WITHDRAW_ORDER_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          _.map(res.data.list, (v) => {
            v.actCny = Decimal(v.actMoney).mul(v.cnyTrans).toFixed(2)
          })
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
        }
      )
    },
    /** 充值状态 */
    toWithdrawStatus (v) {
      this.$router.push({
        name: 'withdrawStatus',
        query: {
          orderNo: v.orderNo,
          showBtn: 0
        }
      })
    }
  }
}
</script>
