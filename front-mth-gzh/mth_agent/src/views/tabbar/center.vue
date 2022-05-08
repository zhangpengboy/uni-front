<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:41:59
 * @Description  : 个人中心
-->
<template>
  <div class="center">
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
    <!-- 个人信息 -->
    <div class="userinfo">
      <div class="d-flex justify-content-between align-items-center px-4 py-5">
        <div class="d-flex align-items-center">
          <img :src="require('@/assets/images/logo.png')" alt="">
          <div class="color-white">
            <div class="d-flex">
              <span class="fs-16 name">{{ userName }}</span>
              <div class="agentBut">{{ areaLevel | filterBitType }}</div>
            </div>
            <p class="fs-14">{{ phone }}</p>
          </div>
        </div>
        <van-icon name="bars" color="#fff" size="20" @click="toPage"/>
      </div>
    </div>
    <!-- 辖区数据 -->
    <div class="bg">
      <p class="fs-14 fw-700 text-left mb-2">辖区数据</p>
      <van-grid :border="false" :column-num="3">
        <van-grid-item v-for="(item, i) in popedomData" :key="i" @click="goPage(item, 'popedomList')">
          <p class="fs-16 color-333 fw-700 mb-2">{{ item.count }}</p>
          <p class="fs-13 color-muted">{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 我的收益 -->
    <div class="bg">
      <p class="fs-14 fw-700 text-left mb-2">我的收益（元）</p>
      <van-grid :border="false" :column-num="3">
        <van-grid-item v-for="(item, i) in earningsData" :key="i" @click="goPage(item, 'earningsDetails')">
          <p class="fs-16 color-333 fw-700 mb-2">{{ item.count }}</p>
          <p class="fs-13 color-muted">{{ item.name }}</p>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      userName: '',
      phone: '',
      areaLevel: null,
      areaId: null,
      popedomData: [],
      earningsData: [
        {
          name: '礼券福袋',
          count: 0
        },
        {
          name: '数字货架',
          count: 0
        },
        {
          name: '云创业',
          count: 0
        }
      ]
    }
  },
  computed: {
    ...mapState(['isApp', 'isH5'])
  },
  created () {
    // if (this.$route.query.item) {
    //   this.areaLevel = this.$route.query.item.areaLevel
    //   this.areaId = this.$route.query.item.areaId
    // }
    // console.log(this.$lance.getData('userId'))
    this.clickAgent()
    // this.getAgent()
  },
  methods: {
    // 代理商跳转前判断
    clickAgent () {
      // 判断是否注册过代理商
      this.$http.post(
        this.$apiUri.APP_DLACCOUNT_ISDL,
        { userId: this.$lance.getData('userId') },
        res => {
          if (!res.data) {
            this.$router.push('agentApply')
          } else {
            // 已注册过代理商且是否待审核状态，
            this.$http.post(
              this.$apiUri.APP_DLACCOUNT_DLSTATUS,
              { userId: this.$lance.getData('userId') },
              res => {
                if (res.data) {
                  this.getAgent()
                } else {
                  // 被拒绝，跳申请页面
                  this.$router.push('agentApply')
                }
              },
              err => {
                this.$toast(err.message)
              }
            )
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取代理商信息
    getAgent () {
      this.$http.post(
        this.$apiUri.APP_DLUSERACCOUNT,
        {
          userId: this.$lance.getData('userId'),
          areaLevel: this.$lance.getJson('areaLevel'),
          areaId: this.$lance.getJson('areaId')
        },
        (res) => {
          this.userName = res.data.userName
          this.phone = res.data.phone
          this.areaLevel = res.data.areaLevel
          this.areaId = res.data.areaId
          this.$lance.setJson('areaLevel', res.data.areaLevel)
          this.$lance.setJson('areaId', res.data.areaId)
          this.getPopedomData()
          this.getIncomeDetail()
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 获取辖区统计
    getPopedomData () {
      this.$http.post(
        this.$apiUri.APP_DLSTATISTICS,
        {
          userId: this.$lance.getData('userId'),
          areaLevel: this.areaLevel,
          areaId: this.areaId
        },
        (res) => {
          this.popedomData = []
          if (res.data.city !== undefined) {
            this.popedomData.push({
              name: '市级代理',
              count: res.data.city,
              type: 1
            })
          }
          if (res.data.district !== undefined) {
            this.popedomData.push({
              name: '区县代理',
              count: res.data.district,
              type: 2
            })
          }
          if (res.data.vipStore !== undefined) {
            this.popedomData.push({
              name: '便利店会员店',
              count: res.data.vipStore,
              type: 3
            })
          }
          if (res.data.Conveniencestore !== undefined) {
            this.popedomData.push({
              name: '便利店联盟店',
              count: res.data.Conveniencestore,
              type: 4
            })
          }
          if (res.data.allianceMerchant !== undefined) {
            this.popedomData.push({
              name: '联盟商家',
              count: res.data.allianceMerchant,
              type: 5
            })
          }
          if (res.data.cloudStore !== undefined) {
            this.popedomData.push({
              name: '数字货架',
              count: res.data.cloudStore,
              type: 6
            })
          }
          if (res.data.mother !== undefined) {
            this.popedomData.push({
              name: '云创业',
              count: res.data.mother,
              type: 7
            })
          }
          // console.log(this.popedomData)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 获取我的收益
    getIncomeDetail () {
      this.$http.post(
        this.$apiUri.APP_INCOMEDETAIL,
        {
          userId: this.$lance.getData('userId'),
          areaLevel: this.areaLevel,
          areaId: this.areaId
        },
        (res) => {
          this.earningsData[0].count = res.data.giftPack
          this.earningsData[1].count = res.data.cloudStore
          this.earningsData[2].count = res.data.giftMother
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    toPage () {
      this.$router.push({
        name: 'region',
        query: {
          areaId: this.areaId
        }
      })
    },
    // 收益详情、代理详情
    goPage (item, name) {
      this.$lance.setJson('details', item)
      this.$router.push(name)
    }
  }
}
</script>
<style lang="scss" scoped>
.center {
  min-height: calc(100vh - 0px);
  padding: 12px;

  // 个人信息
  .userinfo {
    width: 100%;
    height: 112px;
    background-image: url('~@/assets/images/tabbar/center_bg@1x.png');
    background-size: cover;
    background-repeat: inherit;
    margin-bottom: 12px;
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .name {
      max-width: 140px;
      display: inline-block;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-right: 4px;
    }
    .agentBut {
      width: 48px;
      height: 22px;
      font-size: 10px;
      line-height: 22px;
      text-align: center;
      background: #FFFFFF;
      border-radius: 35px;
      color: #EB6133;
      margin-bottom: 4px;
    }
  }
  // 辖区数据
  .bg {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 14px;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  // 我的收益

}
</style>
