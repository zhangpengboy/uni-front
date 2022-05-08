<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-08 12:37:51
 * @Description : 资金记录
-->
<template>
  <div class="center money-list">
    <van-tabs @click="onClickTab">
      <van-tab title="转入" :name="0">
        <!-- 列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了"
          :immediate-check="false"
          @load="getRechargeList"
          v-if="_.size(rechargeList) > 0"
          class="mt-3"
        >
          <div class="main-wrap" v-for="(v, i) in rechargeList" :key="i">
            <van-cell center>
              <template #icon>
                <van-icon
                  class="mr-2"
                  size="22"
                  :name="v.bitType | filterBitImg"
                />
              </template>
              <template #title>
                <span>转入</span>
                <span>{{ v.money }}</span>
                <span> {{ v.bitType | filterBitType }}</span>
              </template>
              <template #label>
                <span>{{ $lance.parseTime(v.createTime) }}</span>
              </template>
              <template #extra>
                <span :class="v.status !== 3 ? 'color-main' : 'color-red'">{{ v.status | filterRechargeStatus }}</span>
              </template>
            </van-cell>
            <div class="d-flex justify-content-end p-2" v-if="v.status === 1">
              <span class="cbtn main" @click="onRemindAudit">提醒审核</span>
            </div>
          </div>
        </van-list>
        <div v-else class="text-center color-light my-4 py-4">
          <van-icon
            :name="require('@/assets/images/order/order-empty@2x.png')"
            size="80"
            class="pr-3"
          ></van-icon>
          <p class="fs-14">暂无记录</p>
        </div>
      </van-tab>
      <van-tab title="转出" :name="1">
        <!-- 列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多数据了"
          :immediate-check="false"
          @load="getWithdrawList"
          class="mt-3"
          v-if="_.size(withdrawList) > 0"
        >
          <div class="main-wrap" v-for="(v, i) in withdrawList" :key="i">
            <van-cell center>
              <template #icon>
                <van-icon
                  class="mr-2"
                  size="22"
                  :name="v.bitType | filterBitImg"
                />
              </template>
              <template #title>
                <span>转出</span>
                <span>{{ v.money }}</span>
                <span> {{ v.bitType | filterBitType }}</span>
              </template>
              <template #label>
                <span>{{ $lance.parseTime(v.createTime) }}</span>
              </template>
              <template #extra>
                <span :class="v.status !== 3 ? 'color-main' : 'color-red'">{{ v.status | filterWithdrawStatus }}</span>
              </template>
            </van-cell>
            <div class="d-flex justify-content-end p-2" v-if="v.status === 0">
              <span class="cbtn main" @click="onRemindAudit">提醒审核</span>
            </div>
          </div>
        </van-list>
        <div v-else class="text-center color-light my-4 py-4">
          <van-icon
            :name="require('@/assets/images/order/order-empty@2x.png')"
            size="80"
            class="pr-3"
          ></van-icon>
          <p class="fs-14">暂无记录</p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isActive: 0,
      bitOptions: [
        { text: '全部币种', value: 0 },
        { text: 'CNY', value: 1 },
        { text: 'BTC', value: 2 },
        { text: 'ETH', value: 3 }
      ],
      withdrawList: [],
      rechargeList: [],
      loading: false,
      finished: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        drawType: 1
      }
    }
  },
  methods: {
    /** tab 切换 */
    onClickTab (name, title) {
      if (this.isActive === name) return
      this.isActive = name
      this.queryParams.pageNum = 1
      this.loading = false
      this.finished = false
      if (this.isActive) {
        this.withdrawList = []
        this.getWithdrawList()
      } else {
        this.rechargeList = []
        this.getRechargeList()
      }
    },
    /** 转出记录 */
    getWithdrawList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_WITHDRAW_ORDER_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          this.withdrawList = _.concat(this.withdrawList, res.data.list)
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
    /** 转入记录 */
    getRechargeList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_RECHARGE_ORDER_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          this.rechargeList = _.concat(this.rechargeList, res.data.list)
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
    /** 提醒审核 */
    onRemindAudit () {
      this.$toast.loading('加载中...')
      setTimeout(() => {
        this.$toast.clear()
        this.$toast('已通知后台审核人员,请耐心等待。')
      }, 1000)
    }
  },
  mounted () {
    this.getRechargeList()
  }
}
</script>
