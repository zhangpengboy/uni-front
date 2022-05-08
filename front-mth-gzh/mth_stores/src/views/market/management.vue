<!-- 商品管理 -->
<template>
  <div class="activityGood">
    <van-nav-bar
      :title="`${$route.query.actName}商品管理`"
      right-text="添加"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-sticky offset-top="1.22667rem">
      <van-tabs
        @click="tabClick"
        v-model="active"
        color="#EB6133"
        title-active-color="#EB6133"
        sticky
      >
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.name"
          :key="index"
        >
        </van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="goods" v-for="(item, index) in list" :key="index">
          <div class="list">
            <div class="item">
              <div class="top" @click="goSaleDetail(item)">
                <div class="img">
                  <!-- <img :src="item.goodsIcon" alt="" /> -->
                  <van-image
                    width="94"
                    height="94"
                    :src="item.goodsIcon"
                  />
                </div>
                <div class="describe">
                  <div class="goodTitle">
                    {{item.goodsName}}
                  </div>
                  <div class="goodNum">
                    <span>库存: {{item.stockQty}}</span><span>已售: {{item.salesVolume}}</span>
                  </div>
                  <div class="price text-price">
                    <span class="pricesize">{{ item.salePrice }}</span>
                    <template v-if="item.integral > 0">
                      <span class="text-xs">{{
                        item.integralType | filterIntegralType
                      }}</span>
                      <span class="pricesize">{{ item.integral }}</span>
                      <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                    </template>
                    <span class="original text-price">{{ item.marketPrice}}</span>
                  </div>
                </div>
              </div>
              <div class="foot">
                <div class="activity">{{actType === '1' ? '推荐商品' : actType === '2' ? '新品商品' : item.actName}}</div>
                <div class="status">
                  <div class="state" @click="operationGoods(item,2)" v-if="item.actGoodsStatus == 3">下架</div>
                  <div class="state" @click="operationGoods(item,0)" >删除</div>
                  <div class="stateup" @click="operationGoods(item,1)" v-if="item.actGoodsStatus == 2 || item.actGoodsStatus == 4">上架</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'management',
  data () {
    return {
      active: 3,
      tabNum: 3,
      tabList: [
        {
          name: '未参加活动',
          id: 0
        },
        {
          name: '审核中',
          id: 1
        },
        {
          name: '待上架',
          id: 2
        },
        {
          name: '在售中',
          id: 3
        },
        {
          name: '已下架',
          id: 4
        },
        {
          name: '未通过',
          id: 5
        }
      ],
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 活动类型
      actType: ''
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      if (from.path === '/addGoods') {
        this.list = []
        this.finished = false
        this.onLoad()
      }
      if (from.name === 'goodsDetails') {
        this.list = []
        this.finished = false
        this.onLoad()
      }
    }
  },
  created () {
    if (this.$route.query.actCode === '1') {
      console.log(999)
      this.actType = this.$route.query.actCode
    } else if (this.$route.query.actCode === '2') {
      this.actType = this.$route.query.actCode
    } else {
      this.queryParams.actCode = this.$route.query.actCode
    }
    this.queryParams.actGoodsStatus = this.active
    this.queryParams.storeId = this.$lance.getData('storeId')
  },
  mounted () {},
  methods: {
    onLoad () {
      this.getData()
    },
    // 获取数据
    getData () {
      this.loading = true
      let API = null
      if (this.actType === '1') {
        API = this.$apiUri.APP_GOODS_RECOMMEND
      } else if (this.actType === '2') {
        API = this.$apiUri.APP_GOODS_NEWS
      } else {
        API = this.$apiUri.APP_GOODS_ACT_LIST
      }
      this.$http.post(API, this.queryParams, res => {
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
        console.log('list', this.list)
      },
      err => {
        this.$toast(err.message)
      })
    },
    // 下拉刷新
    onRefresh () {
      this.isLoading = true
      // 重新加载数据
      this.finished = false
      this.list = []
      this.queryParams.pageNum = 1
      this.onLoad()
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
    // 返回
    onClickLeft () {
      this.$router.back()
    },
    // 上下架 删除
    operationGoods (v, i) {
      if (i === 0) {
        // 删除
        if (this.actType === '1') {
          let obj = {
            goodsId: v.id,
            storeId: v.storeId
          }
          this.$http.post(this.$apiUri.APP_GOODS_RECOMMEND_DELETE, [obj], res => {
            this.list = []
            this.finished = false
            this.onLoad()
            this.$toast('删除成功')
          },
          err => {
            this.$toast(err.message)
          })
        } else if (this.actType === '2') {
          let obj = {
            goodsId: v.id,
            storeId: v.storeId
          }
          this.$http.post(this.$apiUri.APP_GOODS_NEWS_DELETE, [obj], res => {
            this.list = []
            this.finished = false
            this.onLoad()
            this.$toast('删除成功')
          },
          err => {
            this.$toast(err.message)
          })
        } else {
          let arr = []
          arr.push(v.id)
          let obj = {
            actCode: this.queryParams.actCode,
            ids: arr
          }
          this.$http.post(this.$apiUri.APP_GOODS_ACT_DELETE, obj, res => {
            this.list = []
            this.finished = false
            this.onLoad()
            this.$toast('删除成功')
          },
          err => {
            this.$toast(err.message)
          })
        }
      } else {
        let obj = {
          actCode: this.queryParams.actCode,
          id: v.id
        }
        if (i === 1) {
          // 上架
          obj.actGoodsStatus = 3
        } else {
          obj.actGoodsStatus = 4
        }
        this.$http.post(this.$apiUri.APP_GOODS_ACT_UPDATE_STATUS, [obj], res => {
          this.list = []
          this.finished = false
          this.onLoad()
          this.$toast(i === 1 ? '上架成功' : '下架成功')
        },
        err => {
          this.$toast(err.message)
        })
      }
    },
    // 添加
    onClickRight () {
      this.$router.push({
        path: '/addGoods',
        query: {
          actType: this.actType,
          actCode: this.queryParams.actCode,
          actName: this.$route.query.actName,
          storePackId: this.$route.query.storePackId
        }
      })
    },
    // 导航切换
    tabClick (name, title) {
      if (this.tabNum === name) return
      this.tabNum = name
      this.list = []
      this.queryParams.pageNum = 1
      this.queryParams.actGoodsStatus = name
      if (!this.actType || name === 3) {
        this.finished = false
        this.onLoad()
      }
    },
    // 在售中商品详情
    goSaleDetail (v) {
      this.$router.push({
        path: '/goodsDetails',
        query: {
          goodsId: v.id,
          statuType: 1,
          actType: this.actType
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.activityGood {
  margin-bottom: 30px;
}
.goods {
  width: 351px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  margin: 12px auto;
  .list {
    .item {
      padding: 14px;
      .top {
        display: flex;
        .img {
          width: 94px;
          height: 94px;
          background: #b4b4b4;
          opacity: 1;
          border-radius: 4px;
        }
        .describe {
          margin-left: 12px;
          .goodTitle {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 300;
            color: #333333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
          }
          .goodNum {
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: 300;
            color: #999999;
            display: flex;
            span {
              margin-right: 8px;
            }
          }
          .price {
            font-size: 10px;
            font-weight: 300;
            color: #333333;
            .original {
              margin-left: 6px;
              font-size: 12px;
              font-weight: 300;
              color: #999999;
              text-decoration:line-through;
            }
            .pricesize {
              font-size: 16px;
            }
          }
        }
      }
      .foot {
        display: flex;
        justify-content: space-between;
        margin-top: 19px;
        .activity {
          margin-left: -14px;
          // width: 76px;
          // height: 28px;
          padding: 6px 14px;
          background: #ffeee8;
          border-radius: 0px 18px 18px 0px;
          font-size: 12px;
          font-weight: 300;
          color: #eb6133;
        }
        .status {
          display: flex;
          .stateup {
            width: 80px;
            height: 28px;
            border: 1px solid #eb6133;
            border-radius: 85px;
            font-size: 14px;
            font-weight: 300;
            text-align: center;
            line-height: 28px;
            color: #eb6133;
            margin-left: 12px;
          }
          .state {
            width: 80px;
            height: 28px;
            border: 1px solid #c1c1c1;
            border-radius: 85px;
            font-size: 14px;
            font-weight: 300;
            text-align: center;
            line-height: 28px;
            color: #666666;
            margin-left: 12px;
          }
        }
      }
    }
  }
}
</style>
