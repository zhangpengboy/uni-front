<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 子团队
-->
<template>
  <div class="myTeam">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 团队列表信息 -->
      <div class="list">
        <van-list
          v-if="dataOK || myTeamList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <div class="card" v-for="(v, i) in myTeamList" :key="i">
            <div class="left">
              <div class="p1 mb-2">
                <span class="fs-14 color-333 fw-700">{{ v.phone | filterPhone }}</span>
                <!-- <div
                  v-if="v.userLevel === 'P0' && v.vip365 === '0'"
                  class="p0">
                  普通用户
                </div> -->
                <div v-if="v.userLevel === 'P0' && v.vip365 === '1'" class="vip">
                  <img
                  :src="require('@/assets/images/team/team_vip@2x.png')" />
                  <div class="vip-color">vip</div>
                </div>
                <!-- <div v-if="v.userLevel !== 'P0'" class="vip">
                  <img
                  :src="require('@/assets/images/team/team_vip@2x.png')" />
                  <div class="vip-color">{{`vip${v.userLevel.slice(1)}`}}</div>
                </div> -->
              </div>
              <p class="fs-13 color-muted  mb-2">注册时间：{{ $lance.parseTime(v.createTime, '{y}-{m}-{d}') }}</p>
              <!-- <p v-if="v.groupAmount > 0" class="fs-13 color-muted  mb-2">确认时间：{{ $lance.parseTime(v.remittanceTime, '{y}-{m}-{d}') }}</p> -->
              <p class="fs-13 color-muted">伞下人数：{{ v.groupNum }}</p>
            </div>
            <div class="right">
              <p class="fs-13 color-main">{{ v.groupAmount > 0 ? '已确认' : '未确认' }}</p>
              <div v-if="v.userLevel.slice(0, 1) === 'T'" class="clickBut" @click="toPage(v)">查看子团队</div>
            </div>
          </div>
        </van-list>
        <van-empty
          v-else
          class="mt-5"
          :image="require('@/assets/images/empty/no_data@2x.png')"
          description="还没有数据"
        />
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      dataOK: true,
      loading: false,
      finished: false,
      refreshing: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        relatonAccountId: ''
      },
      myTeamList: []
    }
  },

  created () {
    this.title = this.$route.query.phone ? this.$lance.filterPhone(this.$route.query.phone) + '的子团队' : '子团队'
    this.queryParams.relatonAccountId = this.$route.query.accountId
    this.onLoad()
  },
  methods: {
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.dataOK = true
      this.queryParams.pageNum = 1
      this.myTeamList = []
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.loading = true
      this.onLoad()
    },
    // 获取邀请列表
    onLoad () {
      this.loading = true
      // 团队
      this.getAxios(this.$apiUri.APP_DIRECT_TEAM_LIST, this.queryParams)
    },
    // 请求
    getAxios (url, queryParams) {
      this.$http.post(
        url, queryParams,
        (res) => {
          if (this.finished) return
          this.dataOK = false
          this.myTeamList = _.concat(this.myTeamList, res.data.list)
          this.loading = false
          this.refreshing = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        (err) => {
          this.loading = false
          this.dataOK = true
          this.refreshing = false
          this.finished = true
          this.$toast(err.message)
        }
      )
    },
    toPage (v) {
      this.$router.push({
        name: 'subgroup',
        query: {
          phone: v.phone,
          accountId: v.accountId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.myTeam {
  min-height: calc(100vh - 0px);
  // img {
  //   width: 48px;
  //   height: 20px;
  //   margin-left: 10px;
  // }
    // vip
  .vip {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: -10px;
      z-index: 0;
    }
    .vip-color {
      width: 100%;
      height: 18px;
      font-size: 10px;
      background: linear-gradient(180deg, #FEDDA6 0%, #ECB85E 100%);
      border-radius: 0px 9px 9px 0px;
      line-height: 18px;
      padding: 0 10px 0 12px;
      color: #8B5B04;
    }
  }
  // 列表
  .list {
    padding: 12px 14px;
    .card {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      background: #fff;
      border-radius: 8px;
      padding: 14px 12px;
      margin-bottom: 12px;
      .left {
        .p1 {
          display: flex;
          align-items: center;
          span {
            height: 20px;
            line-height: 24px;
          }
        }
      }
      .right {
        text-align: right;
        .clickBut {
          width: 88px;
          height: 28px;
          font-size: 13px;
          background: #EB6132;
          border-radius: 309px;
          line-height: 28px;
          color: #fff;
          text-align: center;
          margin-top: 26px;
        }
      }
    }
  }
}
</style>
