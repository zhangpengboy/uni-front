<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 我的收益
-->
<template>
  <div class="list">
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-if="list.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getList"
        >
          <div
            class="tab"
            v-for="(item, i) in list"
            :key="i"
            @click="toPage(item)"
          >
            <div class="d-flex align-items-start text">
              <div class="ml-2">
                <p class="fs-14 color-333 fw-700">{{ item.note }}</p>
                <p class="fs-13 my-2 color-muted">
                  奖励金额：{{ item.moneyPlanOrder }}元
                </p>
                <p class="fs-13 color-muted">
                  开通时间：{{ $lance.parseTime(item.createTime) }}
                </p>
              </div>
            </div>
            <div class="fs-13 color-main status">
              {{ filerStatus(item.status) }}
            </div>
          </div>
        </van-list>
        <van-empty
          v-else
          class="mt-5"
          :image="require('@/assets/images/empty/no_data@2x.png')"
          description="还没有数据"
        />
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$lance.getData('userId')
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.queryParams.pageNum = 1
      this.list = []
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 过滤状态
    filerStatus (i) {
      return ['待执行', '执行中', '已成功', '失败'][i]
    },
    getList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_GET_PLAN_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            return (this.finished = true)
          }
          this.queryParams.pageNum++
        }
      )
    },
    toPage (item) {
      this.$lance.setJson('myRaword', item)
      this.$router.push({ name: 'myRawordDetail' })
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  min-height: calc(100vh - 0px);
  .count {
    width: 100%;
    height: 52px;
    font-size: 14px;
    background-image: url("~@/assets/images/tabbar/taber_bg@2x.png");
    background-size: cover;
    background-repeat: inherit;
    line-height: 52px;
    text-align: center;
    color: #fff;
    font-weight: 700;
  }
  .status {
    width: 58px;
    text-align: center;
  }
  .name {
    width: 210px;
    text-align: left;
  }
  .content {
    padding: 12px;
    .tab {
      height: 100%;
      display: flex;
      justify-content: space-between;
      background: #ffffff;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      .text {
        max-width: 268px;
      }
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
  }
}
</style>
