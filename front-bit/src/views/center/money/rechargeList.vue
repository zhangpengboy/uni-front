<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 充值记录
-->

<template>
  <div class="center">
    <van-sticky :offset-top="46">
      <van-tabs v-model="active">
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="处理中" name="1"></van-tab>
        <van-tab title="已完成" name="2"></van-tab>
        <van-tab title="已取消" name="4"></van-tab>
      </van-tabs>
    </van-sticky>

    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
      class="mt-2"
      @load="getRechargeList()"
    >
      <div
        class="main-wrap"
        v-for="(v, i) in list"
        :key="i"
        @click="toRechargeStatus(v)"
      >
        <van-cell class="fs-12">
          <template #default>
            <span :class="v.status === 4 ? 'color-red' : 'color-main'">{{
              v.status | filterRechargeStatus
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
            <p class="fs-12">{{ v.bitType | filterBitType }}转入</p>
            <h2 class="fw-b mt-2">
              <span class="fs-12">&yen;</span>
              <span class="fs-20">{{ v.money }}</span>
            </h2>
          </div>
          <div class="w-50">
            <p
              class="d-flex justify-content-between align-items-center mb-2 fs-12 van-ellipsis"
            >
              <span class="color-light">单价</span>
              <span>{{ v.bitType === 1 ? 1 : v.bitPrice }} CNY</span>
            </p>
            <p
              class="d-flex justify-content-between align-items-center fs-12 van-ellipsis"
            >
              <span class="color-light">数量</span>
              <span>{{ v.bitType === 1 ? v.money : v.money / v.bitPrice }} CNY</span>
            </p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: '',
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        bitType: 1, // 支付类型:1>CNY;2>BTC;3>ETH
        status: null, // 0->待付款；1->审核中；2->已成功；3->失败；；4->关闭
        pageNum: 1,
        pageSize: 5
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
          bitType: 1, // 支付类型:1>CNY;2>BTC;3>ETH
          status: newV, // 0->待付款；1->审核中；2->已成功；3->失败；；4->关闭
          pageNum: 1,
          pageSize: 5
        }
      )
      this.getRechargeList()
    }
  },
  mounted () {
    // this.orderNo = this.$route.query.orderNo;
    this.getRechargeList()
  },
  methods: {
    /** 获取订单详情 */
    getRechargeList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_RECHARGE_ORDER_LIST,
        this.queryParams,
        (res) => {
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
        }
      )
    },
    /** 充值状态 */
    toRechargeStatus (v) {
      this.$router.push({
        name: 'rechargeStatus',
        query: {
          orderNo: v.orderNo
        }
      })
    }
  }
}
</script>
