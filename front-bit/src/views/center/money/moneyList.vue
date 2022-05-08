<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-08 12:37:51
 * @Description : 交易记录
-->
<template>
  <div class="center money-list">
    <van-dropdown-menu active-color="#1e74e4">
      <van-dropdown-item v-model="queryParams.bitType" :options="bitOptions" @change="onClickMenu"/>
      <van-dropdown-item v-model="queryParams.status" :options="typeOptions" @change="onClickMenu"/>
    </van-dropdown-menu>
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
      @load="getList"
      v-if="_.size(list) > 0"
    >
      <van-cell-group>
        <van-cell center v-for="(v, i) in list" :key="i">
          <template #icon>
            <van-icon class="mr-2" size="22" :name="v.bitType | filterBitImg"/>
          </template>
          <template #title>
            <span>{{v.bitType | filterBitType }}</span>
          </template>
          <template #label>
            <span>{{ $lance.parseTime(v.createTime) }}</span>
          </template>
          <template #default>
            <p class="fs-12 color-light">
              {{ v.des }}
            </p>
            <p>
            <span>{{queryParams.status === 1 ? '+' : '-'}}</span>
            <span>{{ v.money }}</span>
            </p>
          </template>
        </van-cell>
      </van-cell-group>
    </van-list>
    <div v-else class="text-center color-light my-4 py-4">
      <van-icon
        :name="require('@/assets/images/order/order-empty@2x.png')"
        size="80"
        class="pr-3"
      ></van-icon>
      <p class="fs-14">暂无记录</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isActive: 1,
      bitOptions: [
        { text: '全部币种', value: '' },
        { text: 'CNY', value: 1 },
        { text: 'BTC', value: 2 },
        { text: 'ETH', value: 3 },
        { text: 'FIL', value: 4 },
        { text: 'XCH', value: 5 }
      ],
      typeOptions: [
        { text: '转出', value: 0 },
        { text: '转入', value: 1 }
      ],
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        busType: '',
        bitType: 1, // 1-CNY 2-BTC 3-ETH,
        status: 0, // 0-转出 1-转入
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    onClickMenu () {
      this.queryParams.pageNum = 1
      this.list = []
      this.loading = false
      this.finished = false
      this.getList()
    },
    /** 获取交易记录列表 */
    getList () {
      this.loading = true
      this.$http.post(this.$apiUri.APP_ASSETS_LIST, this.queryParams, (res) => {
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
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
