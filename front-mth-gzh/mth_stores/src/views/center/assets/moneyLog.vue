<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 14:46:27
 * @Description : 提现记录
-->

<template>
  <div>
    <!-- <van-row class="top-tab">
      <van-col span="6">账号</van-col>
      <van-col span="6">到账金额</van-col>
      <van-col span="8">提现时间</van-col>
      <van-col span="4">状态</van-col>
    </van-row> -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
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
            <p class="fs-14 color-text fw-700 mb-2">{{ item.des }}</p>
            <p class="fs-13 color-muted ">{{ $lance.parseTime(item.createTime) }}</p>
          </div>
          <div class="fs-14 color-text fw-700">{{ item.status == 1 ? `+${item.amount}` : `-${item.amount}` }}</div>
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
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      dataOK: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        freeStatus: 1,
        accountId: ''
      }
    }
  },

  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.accountId = this.$lance.getData('accountId')
      this.queryParams.accountId = this.accountId
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_ADD_DJ_LIST,
        this.queryParams,

        res => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          this.dataOK = false
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
        })
    },
    onRefresh () {
      this.$toast('刷新成功')
      this.isLoading = false
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.moneys {
  float: right;
  width: 100%;
  height: 30px;
  margin-top: -20px;
  margin-right: 15px;
  color: #eb6133;
  text-align: right;
}
.money {
  float: right;
  width: 100%;
  height: 30px;
  margin-top: -20px;
  margin-right: 15px;
  text-align: right;
}
.time {
  margin-top: 12px;
  color: #999999;
  font-weight: 300;
  font-size: 13px;
  text-indent: 15px;
}
.top {
  // display: flex;
  // justify-content: space-around;
  // align-items: center;width: 30px;
  height: 21px;
  font-size: 18px;
  font-weight: 500;
  text-indent: 15px;
  padding-top: 16px;
  line-height: 21px;
  color: #333333;
  opacity: 1;
}
.list-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
  padding: 5px 12px;
}

.top-tab {
  width: 100%;
  z-index: 10;
  position: fixed;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #eb6132;
  color: #fff;
}

.billmsg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  border-bottom: 1px solid#eee;
}
</style>
