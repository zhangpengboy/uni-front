<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 我的团队
-->
<template>
  <div class="myTeam">
    <van-nav-bar
      v-if="isApp"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-nav-bar
      v-if="isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 头部个人信息 -->
      <div class="info mb-0">
        <div>
          <div class="userName">
            <span class="mr-1">{{ myTeamData.userPhone }}</span>
            <div v-if="myTeamData.user.vipStatus === 0" class="p0">
              普通用户
            </div>
            <div v-if="myTeamData.user.vipStatus === 1" class="vip">
              <img :src="require('@/assets/images/team/team_vip@2x.png')" />
              <div class="vip-color">vip</div>
            </div>
            <div v-if="myTeamData.user.userLevel != 'P0'" class="pp">
              {{ myTeamData.user.userLevel | filterAgentText }}
            </div>
          </div>
          <div class="userName">
            <span class="fs-14 color-white fw-700">我的邀请人：</span>
            <span class="fs-12 mr-1">{{
              myTeamData.userInvitationPhone
                ? myTeamData.userInvitationPhone
                : "暂无邀请人"
            }}</span>
          </div>
        </div>
        <div class="inviteInfo">
          <div class="invite">
            <p class="fs-16 color-main mb-2">
              {{ myTeamData.directVipCount || 0 }}/{{
                myTeamData.directCount || 0
              }}
            </p>
            <p class="fs-13 color-muted">直邀</p>
          </div>
          <div class="indirect"></div>
          <router-link tag="div" to="/myRaword" class="invite">
            <p class="fs-16 color-main mb-2">
              {{ myTeamData.incomeMoney || 0 }}
            </p>
            <p class="fs-13 color-muted">我的收益</p>
          </router-link>
          <!-- <template v-if="myTeamData.user.userLevel.slice(0, 1) === 'T'">
            <div class="indirect"></div>
            <div class="invite">
              <p class="fs-16 color-main mb-2">{{myTeamData.user.groupVipNum || 0}}/{{myTeamData.user.groupNum || 0}}</p>
              <p class="fs-13 color-muted">团队</p>
            </div>
          </template> -->
        </div>
      </div>
      <!-- <van-sticky>
        <van-tabs
          v-model="active"
          title-active-color="#EB6133"
          title-inactive-color="#333"
          color="#EB6133"
          @click="switchTabs"
        >
          <van-tab title="引新"></van-tab>
          <van-tab title="介新"></van-tab>
          <van-tab  v-if="myTeamData.user.userLevel.slice(0, 1) === 'T'" title="团队"></van-tab>
        </van-tabs>
      </van-sticky> -->
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
                <span class="fs-14 color-333 fw-700">{{
                  v.phone | filterPhone
                }}</span>
                <div v-if="v.vipStatus === 1" class="vip">
                  <img :src="require('@/assets/images/team/team_vip@2x.png')" />
                  <div class="vip-color">vip</div>
                </div>
              </div>
              <p class="fs-13 color-muted mb-2">
                注册时间：{{ $lance.parseTime(v.createTime) }}
              </p>
              <!-- <p v-if="v.groupAmount > 0" class="fs-13 color-muted  mb-2">确认时间：{{ $lance.parseTime(v.remittanceTime, '{y}-{m}-{d}') }}</p> -->
              <p v-if="active === 2" class="fs-13 color-muted">
                伞下人数：{{ v.groupNum }}
              </p>
            </div>
            <div class="right">
              <div class="fs-13 color-main">
                {{ v.userLevel | filterAgentText }}
              </div>
              <!-- <p v-if="active === 2" class="fs-13 color-main">
                {{ v.groupAmount > 0 ? "已确认" : "未确认" }}
              </p> -->
              <!-- <div
                v-if="active === 2 && v.userLevel.slice(0, 1) === 'T'"
                class="clickBut"
                @click="toPage(v)"
              >
                查看子团队
              </div> -->
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
import { mapState } from 'vuex'
export default {
  data () {
    return {
      active: 0,
      dataOK: true,
      loading: false,
      finished: false,
      refreshing: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        relatonAccountId: ''
      },
      myTeamData: {
        user: {
          userLevel: 'P0',
          accountId: ''
        }
      },
      myTeamList: []
    }
  },
  computed: {
    ...mapState(['isApp', 'isH5'])
  },
  created () {
    this.getInfo()
    // this.onLoad()
  },
  methods: {
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.active = 0
      this.queryParams.pageNum = 1
      this.myTeamList = []
      this.myTeamData = {
        user: {
          userLevel: '',
          accountId: ''
        }
      }
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.loading = true
      this.getInfo()
      // this.onLoad()
    },
    // 切换tabs
    switchTabs (name) {
      this.myTeamList = []
      this.finished = false
      this.loading = false
      this.dataOK = true
      this.active = name
      this.queryParams = _.assign(
        {},
        {
          relatonAccountId: '',
          pageNum: 1,
          pageSize: 10
        }
      )
      this.onLoad()
    },
    // 获取邀请列表
    onLoad () {
      this.loading = true
      this.queryParams.relatonAccountId = this.myTeamData.user.accountId
      if (this.active === 0) {
        // 直邀
        this.getAxios(this.$apiUri.APP_DIRECT_LIST, this.queryParams)
      }
      if (this.active === 1) {
        // 间邀
        this.getAxios(this.$apiUri.APP_INVITATION_LIST, this.queryParams)
      }
      if (this.active === 2) {
        // 团队
        this.getAxios(this.$apiUri.APP_DIRECT_TEAM_LIST, this.queryParams)
      }
    },
    // 请求
    getAxios (url, queryParams) {
      this.$http.post(
        url,
        queryParams,
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
          this.finished = true
          this.refreshing = false
          this.$toast(err.message)
        }
      )
    },
    // 获取账户邀请信息
    getInfo () {
      this.$http.post(
        this.$apiUri.APP_USERREKATUIBINFO,
        { userId: this.$lance.getData('userId') },
        (res) => {
          this.myTeamData = res.data
          this.refreshing = false
          this.queryParams.relatonAccountId = this.myTeamData.user.accountId
          this.getAxios(this.$apiUri.APP_DIRECT_LIST, this.queryParams)
        },
        (err) => {
          this.refreshing = false
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
  // 普通用户
  .p0 {
    width: 52px;
    height: 18px;
    font-size: 10px;
    background: #ffffff;
    border-radius: 9px;
    line-height: 18px;
    text-align: center;
    color: #333;
  }
  .pp {
    width: 52px;
    height: 18px;
    font-size: 10px;
    background: #eb6132;
    border-radius: 9px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
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
      background: linear-gradient(180deg, #fedda6 0%, #ecb85e 100%);
      border-radius: 0px 9px 9px 0px;
      line-height: 18px;
      padding: 0 10px 0 12px;
      color: #8b5b04;
    }
  }
  // 顶部用户信息
  .info {
    width: 100%;
    height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: url("~@/assets/images/team/team_bg@1x.png");
    background-size: cover;
    background-repeat: inherit;
    margin-bottom: 12px;
    padding: 20px 0 16px 16px;
    .userName {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #fff;
    }
    .inviteInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .invite {
        text-align: center;
      }
      .indirect {
        width: 1px;
        height: 36px;
        background: #eeeeee;
      }
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
          background: #eb6132;
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
