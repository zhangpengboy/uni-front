<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 收益的详情
-->
<template>
  <div class="earningsDetails">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />

    <!-- <van-cell-group v-if="dataOK || list.length > 0">
      <van-cell center v-for="(item, i) in list" :key="i">
        <template #title>
          <span class="fs-14 color-333 fw-700">{{ `${item.mark}` }}</span>
        </template>
        <template #label>
          <span class="fs-13 color-muted">{{ `开通时间：${$lance.parseTime(item.createTime)}` }}</span>
        </template>
        <template #default>
          <p class="fs-14 color-main fw-700">{{ `￥${item.amount}` }}</p>
          <p class="fs-13 color-333 fw-700">{{ item.status | filterDlProfitListStatus}}</p>
        </template>
      </van-cell>
      </van-cell-group> -->
      <div class="bisc" v-if="dataOK || list.length > 0">
        <div class="counter" v-for="(item, i) in list" :key="i">
          <div class="left">
            <p class="fs-14 color-333 fw-700">{{ `${item.mark}` }}</p>
            <p class="fs-13 color-muted time">{{ `开通时间：${$lance.parseTime(item.createTime)}` }}</p>
          </div>
          <div class="right">
            <p class="fs-13" :class="[ item.status === 1 ? 'color-red' : 'color-light']">{{ item.status | filterDlProfitListStatus}}</p>
            <p class="fs-14 color-main fw-700">{{ `￥${item.amount}` }}</p>
          </div>
        </div>
      </div>
      <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_data@2x.png')"
      description="还没有数据"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      list: [],
      dataOK: true
    }
  },

  created () {
    const details = this.$lance.getJson('details')
    this.title = details.name
    if (this.title === '礼券福袋') {
      this.getList(1)
    }
    if (this.title === '数字货架') {
      this.getList(2)
    }
    if (this.title === '云创业') {
      this.getList(3)
    }
  },
  methods: {

    getList (logType) {
      this.$http.post(
        this.$apiUri.APP_INCOMEDETAIL_LIST,
        { userId: this.$lance.getData('userId'),
          areaId: this.$lance.getJson('areaId'),
          logType: logType },
        (res) => {
          this.dataOK = false
          this.list = res.data
        },
        (err) => {
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.earningsDetails {
  background: #fff;
  .bisc {
    padding: 0 14px;
    .counter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #DFDFDF;
      padding: 14px 0 16px;
      .time {
        margin-top: 8px;
      }
    }
  }
}
</style>
