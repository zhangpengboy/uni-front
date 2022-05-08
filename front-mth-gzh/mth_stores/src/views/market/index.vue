<!-- 营销管理 -->
<template>
  <div class="management">
    <van-nav-bar
      :title="$route.meta.title"
      right-text="报名活动"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-sticky>
      <van-tabs
        v-model="active"
        @click="tabClick"
        color="#EB6133"
        title-active-color="#EB6133"
        sticky
      >
        <van-tab title="兑换中心"></van-tab>
        <van-tab title="精品商城"></van-tab>
        <van-tab title="店铺装饰"></van-tab>
      </van-tabs>
    </van-sticky>
    <div class="activities" v-for="(item, index) in typeList" :key="index">
      <div class="nameOfEvent" v-if="isnameOfEvent">
        {{
          item[0].actType == 1
            ? "底部栏"
            : item[0].actType == 2
            ? "金刚区"
            : item[0].actType == 3
            ? "活动区"
            : "列表区"
        }}
      </div>
      <div class="list">
        <div
          class="item"
          @click="selectActivity(v, i, index)"
          v-for="(v, i) in item"
          :key="i"
          :class="{ active: index == oneIndex && i == twoIndex }"
        >
          <div class="items">
            <span>{{ v.actName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'market',
  data () {
    return {
      actCode: '',
      active: 0,
      oneIndex: 0,
      twoIndex: 0,
      isnameOfEvent: true,
      storeInfo: {},
      typeList: [],
      tabNum: 0
    }
  },
  computed: {},
  watch: {},
  created () {
    this.storeInfo = this.$lance.getJson('storeInfo')
    // 进入页面默认为兑换中心code
    this.actCode = this.$stringActCode.exchangeCode()
    this.getActCommonList()
  },
  mounted () {},
  methods: {
    // 获取数据
    getActCommonList () {
      this.$http.post(
        this.$apiUri.APP_GOODS_STOREPACKLIST,
        {
          storeId: this.storeInfo.storeId,
          role: this.storeInfo.storeRoleCode
        },
        (res) => {
          let arr1 = []
          let arr2 = []
          let arr3 = []
          let arr4 = []
          let exchangeList = []
          let mallList = []
          res.data.map((item) => {
            if (item.pcode === this.$stringActCode.exchangeCode()) {
              exchangeList.push(item)
            } else if (item.pcode === this.$stringActCode.mallCode()) {
              mallList.push(item)
            }
          })
          if (this.tabNum === 0) {
            exchangeList.map((item) => {
              if (item.actType === 1) {
                arr1.push(item)
              } else if (item.actType === 2) {
                arr2.push(item)
              } else if (item.actType === 3) {
                arr3.push(item)
              } else if (item.actType === 4) {
                arr4.push(item)
              }
            })
          } else {
            mallList.map((item) => {
              if (item.actType === 1) {
                arr1.push(item)
              } else if (item.actType === 2) {
                arr2.push(item)
              } else if (item.actType === 3) {
                arr3.push(item)
              } else if (item.actType === 4) {
                arr4.push(item)
              }
            })
          }
          if (arr1.length) {
            this.typeList.push(arr1)
          }
          if (arr2.length) {
            this.typeList.push(arr2)
          }
          if (arr3.length) {
            this.typeList.push(arr3)
          }
          if (arr4.length) {
            this.typeList.push(arr4)
          }
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    },
    onClickRight () {
      this.$router.push('registration')
    },
    // 顶部导航切换
    tabClick (name, title) {
      if (this.tabNum === name) return
      this.typeList = []
      this.tabNum = name
      if (name === 0) {
        // 兑换中心 code
        this.actCode = this.$stringActCode.exchangeCode()
        this.isnameOfEvent = true
        this.getActCommonList()
      } else if (name === 1) {
        // 精品商城 code
        this.actCode = this.$stringActCode.mallCode()
        this.isnameOfEvent = true
        this.getActCommonList()
      } else {
        this.typeList = []
        this.isnameOfEvent = false
        let arr = [
          {
            actCode: '1',
            actType: 1,
            actName: '推荐商品'
          },
          {
            actCode: '2',
            actType: 1,
            actName: '新品商品'
          }
        ]
        this.typeList.push(arr)
      }
    },
    // 活动点击
    selectActivity (v, i, index) {
      console.log(i)
      console.log(this.tabNum)
      this.oneIndex = index
      this.twoIndex = i
      this.$router.push({
        path: '/management',
        query: {
          actCode: v.actCode,
          actName: v.actName,
          storePackId: v.id
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.management {
  margin-bottom: 70px;
  .activities {
    width: 351px;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    margin: 12px auto;
    .nameOfEvent {
      padding: 14px 14px 0px 14px;
      font-size: 16px;
      font-weight: 300;
      color: #666666;
      opacity: 1;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      padding-top: 14px;
      // margin: 0 14px 14px 14px;
      .item {
        width: 97px;
        height: 52px;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        color: #333333;
        opacity: 1;
        margin-bottom: 14px;
        margin-left: 15px;
        border-radius: 8px;
        text-align: center;
        line-height: 52px;
        .items {
          font-size: 14px;
          font-weight: 300;
          opacity: 1;
        }
      }
      .active {
        color: #eb6133;
        background: #ffffff;
        border: 1px solid #eb6133;
      }
    }
  }
}
</style>
