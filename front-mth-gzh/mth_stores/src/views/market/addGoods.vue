<!-- 订单管理 -->
<template>
  <div class="addGoods">
    <van-search
      @search="onSearch"
      autofocus
      show-action
      shape="round"
      v-model="goodsName"
      placeholder="请输入商品名称进行查询"
    >
      <template #left>
        <van-icon
          @click="$router.back()"
          style="margin-right: 0.13513rem;"
          name="arrow-left"
        />
      </template>

      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-checkbox-group v-model="good" ref="checkboxGroup" @change="goodsChange">
      <div class="goods">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-checkbox :name="item" checked-color="#EB6132" v-for="(item, index) in list" :key="index">
              <template>
                  <div class="list">
                    <div class="item">
                      <div class="top">
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
                            <span>库存: {{item.stockQty}}</span>
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
                    </div>
                  </div>
              </template>
            </van-checkbox>
         </van-list>
        </van-pull-refresh>
      </div>
    </van-checkbox-group>
    <div class="foot">
        <div class="function">
          <!-- <template> -->
            <van-checkbox v-model="checkedAll" checked-color="#EB6132"  @change="checkAll">全选</van-checkbox>
          <!-- </template> -->
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <!-- <template> -->
            <div class="subBut" @click="submit" :class="{active: listChange.length}">确定</div>
          <!-- </template> -->
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'addGoods',
  data () {
    return {
      goodsName: '',
      good: [],
      listChange: [],
      checkedAll: false,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.queryParams.actived = 0 // 未参与活动
    this.queryParams.status = 3 // 未参与活动
    this.queryParams.storeId = this.$lance.getData('storeId')
  },
  mounted () {},
  methods: {
    onLoad () {
      this.loading = true
      this.$http.post(this.$apiUri.APP_STORE_GOODSLIST, this.queryParams, res => {
        if (this.finished) return
        this.list = _.concat(this.list, res.data.list)
        this.loading = false
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === this.queryParams.pageNum
        ) {
          this.checkedAll = false
          return (this.finished = true)
        }
        this.queryParams.pageNum++
      })
    },
    // 下拉刷新
    onRefresh () {
      this.isLoading = true
      // 重新加载数据
      this.finished = false
      this.list = []
      this.checkedAll = false
      this.queryParams.pageNum = 1
      this.queryParams.goodsName = ''
      this.goodsName = ''
      this.onLoad()
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
    onClickLeft () {
      this.$router.back()
    },
    onSearch () {
      // if (this.goodsName) {
      this.list = []
      this.queryParams.goodsName = this.goodsName
      this.queryParams.pageNum = 1
      this.finished = false
      this.onLoad()
      // }
    },
    // 选择商品
    goodsChange (e) {
      console.log(12, e)
      this.listChange = e
    },
    // 确定
    submit () {
      if (!this.listChange.length) return
      console.log(this.listChange)
      console.log('this.$route.query.actCode', this.$route.query.actType)
      if (this.$route.query.actType === '1') {
        let arr = []
        this.listChange.map(item => {
          let obj = {
            goodsId: item.id,
            storeId: item.storeId,
            storeName: item.storeName
          }
          arr.push(obj)
        })
        this.$http.post(this.$apiUri.APP_GOODS_RECOMMEND_ADD, arr, res => {
          this.$router.back()
        },
        err => {
          this.$toast(err.message)
        })
      } else if (this.$route.query.actType === '2') {
        let arr = []
        this.listChange.map(item => {
          let obj = {
            goodsId: item.id,
            storeId: item.storeId,
            storeName: item.storeName
          }
          arr.push(obj)
        })
        this.$http.post(this.$apiUri.APP_GOODS_NEWS_ADD, arr, res => {
          this.$router.back()
        },
        err => {
          this.$toast(err.message)
        })
      } else {
        let arr = []
        this.listChange.map(item => {
          let obj = {
            actCode: this.$route.query.actCode,
            actName: this.$route.query.actName,
            goodsId: item.id,
            storeId: item.storeId,
            storeName: item.storeName,
            storePackId: this.$route.query.storePackId
          }
          arr.push(obj)
        })
        this.$http.post(this.$apiUri.APP_GOODS_ACT_ADD, arr, res => {
          this.$router.back()
        },
        err => {
          this.$toast(err.message)
        })
      }
    },
    // 全选
    checkAll (v) {
      this.checkedAll = v
      if (v) {
        this.$refs.checkboxGroup.toggleAll(true)
      } else {
        this.$refs.checkboxGroup.toggleAll(false)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.addGoods{
  background-color: #fff;
}
.foot {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: -4px;
  background-color: #fff;
  z-index: 99;
  .function {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 14px;
    .subBut {
      width: 100px;
      height: 38px;
      border: 1px solid #C1C1C1;
      border-radius: 80px;
      font-size: 16px;
      font-weight: 300;
      line-height: 38px;
      text-align: center;
      color: #666666;
    }
    .active {
        border: 1px solid #ea6331;
        color: #fff;
        background-color: #ea6331;
    }
  }
}
.goods {
  width: 351px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  margin: 12px auto 60px;
  .list {
    .item {
      padding: 12px 14px 12px 6px;
      border-bottom: 1px solid #f6f6f6;
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
    }
  }
}
</style>
