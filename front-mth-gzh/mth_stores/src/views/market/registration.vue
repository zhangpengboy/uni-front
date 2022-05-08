<!-- 报名活动 -->
<template>
  <div class="registration">
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
            <span>{{ v.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'registration',
  data () {
    return {
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
        this.$apiUri.APP_GOODS_GOODSCOMMON,
        {
          // actCode: this.actCode,
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
          } else if (this.tabNum === 1) {
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
            let List = arr1.sort(this.compare('weight'))
            this.typeList.push(List)
          }
          if (arr2.length) {
            let List = arr2.sort(this.compare('weight'))
            this.typeList.push(List)
          }
          if (arr3.length) {
            let List = arr3.sort(this.compare('weight'))
            this.typeList.push(List)
          }
          if (arr4.length) {
            let List = arr4.sort(this.compare('weight'))
            this.typeList.push(List)
          }
          console.log('this.typeList', this.typeList)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    compare (property) {
      return (a, b) => {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
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
      }
    },
    // 活动点击
    selectActivity (v, i, index) {
      this.oneIndex = index
      this.twoIndex = i
      this.$router.push({
        path: '/toSignUp',
        query: {
          nick: v.name,
          code: v.code
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.registration {
  margin-bottom: 30px;
  .activities {
    width: 351px;
    background: #ffffff;
    opacity: 1;
    border-radius: 8px;
    margin: 12px auto;
    .nameOfEvent {
      padding: 14px;
      font-size: 16px;
      font-weight: 300;
      color: #666666;
      opacity: 1;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 97px;
        height: 52px;
        background: #ffffff;
        border: 1px solid #f2f2f2;
        color: #333333;
        opacity: 1;
        margin-left: 15px;
        margin-bottom: 14px;
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
