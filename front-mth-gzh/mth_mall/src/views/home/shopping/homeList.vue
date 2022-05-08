<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getHomeGoodsList"
      >
        <div class="tabge">
          <div
            style="display: flex;flex-wrap: wrap;justify-content:space-between;margin: 0.32432rem;"
          >
            <div
              class="boxlist"
              v-for="item in list"
              :key="item.id"
              @click="toDity(item)"
            >
              <div class="image">
                <van-image
                  style="border-radius: 8px 8px 0px 0px; overflow: hidden;"
                  width="100%"
                  height="100%"
                  :src="item.goodsIcon"
                />
                <div class="text">
                  {{ item.goodsName }}
                </div>
                <div class="forson">
                  <span>{{ item.goodsTitle }}</span>
                </div>
                <div class="ml-1 price text-price text-main">
                  <span>{{ item.salePrice }}</span>
                  <template v-if="item.integral > 0">
                    <span class="text-xs">{{
                      item.integralType | filterIntegralType
                    }}</span>
                    <span>{{ item.integral }}</span>
                    <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                  </template>
                  <span class="text-marketPrice">{{
                    `¥ ${item.marketPrice}`
                  }}</span>
                </div>
                <!-- <div class="formoney">
                  <span>￥</span><span>{{ item.salePrice }}</span
                  ><span style="font-size:10px">送</span>{{ item.integral
                  }}<span style="font-size:10px;">礼券</span
                  ><del>{{ item.marketPrice }}</del>
                </div> -->
              </div>
            </div>
          </div>
          <!-- <van-divider
          :style="{
            color: '#EB6132',
            borderColor: '#EB6132',
            padding: '0 16px'
          }"
        >
          没有更多了
        </van-divider> -->
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      queryParams: {
        actCode: '',
        pcode: 'mth_lwcrtiej',
        pageNum: 1,
        pageSize: 10
      },
      actCodeObj: {}
    }
  },

  created () {
    this.actCodeObj = this.$lance.getJson('actCode')
    this.queryParams.actCode = this.actCodeObj.code
    this.getHomeGoodsList()
  },

  methods: {
    getHomeGoodsList () {
      if (this.queryParams.actCode === '0000') {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }

        this.loading = true
        this.$http.post(this.$apiUri.APP_PAGELIST, this.queryParams, res => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        })

        // this.$http.post(this.$apiUri.APP_PAGELIST, this.queryParams, res => {
        //   if (res.code == 200) {
        //     if (this.finished) return
        //     this.homeList = res.data.list
        //   }
        // })
      } else {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }

        this.loading = true
        this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        })
        // this.queryParams.actCode = this.actCodeObj.code
        // this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
        //   if (res.code == 200) {
        //     this.homeList = res.data.list
        //   }
        // })
      }
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.queryParams.pageNum = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getHomeGoodsList()
    },
    // 点击跳转商品详情
    toDity (e) {
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: e.id,
          bsType: 'BS_A001'
        }
      })
    }
    // 商品列表
    // getHomeGoodsList () {
    //   console.log(999, this.queryParams.actCode)
    //   if (this.queryParams.actCode == '0000') {
    //     console.log(11, this.queryParams.actCode)
    //     this.$http.post(this.$apiUri.APP_PAGELIST, this.queryParams, res => {
    //       if (res.code == 200) {
    //         this.homeList = res.data.list
    //       }
    //     })
    //   } else {
    //     // this.queryParams.actCode = this.actCodeObj.code
    //     this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
    //       if (res.code == 200) {
    //         this.homeList = res.data.list
    //       }
    //     })
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.head {
  height: 64px;
  border-bottom: 1px solid #f6f6f6;
  background: #ffffff;
  opacity: 1;
  line-height: 64px;
  display: flex;
  padding-top: 10px;
  position: fixed;
  z-index: 999;
  margin-bottom: 10px;
  .brand {
    margin-left: 32%;
  }
}
.van-icon {
  position: relative;
  display: inline-block;
  font: normal normal normal 0.37333rem/1 'vant-icon';
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  background-color: #fff;
  border-left: 1px solid #dedede;

  width: 60px;
}
.right {
  width: 40px;
  height: 32px;
  font-size: 28px;
  background-color: #fff;
  margin-top: -36px;
  margin-left: 334px;
}
.formoney {
  height: 21px;
  font-size: 15px;
  font-weight: 500;
  line-height: 21px;
  color: #eb6133;
  text-indent: 5px;

  opacity: 1;
  span:nth-child(1) {
    font-size: 12px;
  }
  del {
    margin-left: 5px;
    font-size: 11px;
    font-weight: 300;
    line-height: 16px;
    color: #999999;
    opacity: 1;
  }
}
.forson {
  font-size: 12px;
  font-weight: 300;
  line-height: 17px;
  color: #999999;
  opacity: 1;
  margin-top: 5px;
  text-indent: 5px;
  margin-bottom: 5px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.text {
  width: 100%;
  height: 36px;
  padding-left: 5px;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 300;
  color: #333333;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.boxlist {
  width: 170px;
  height: 270px;
  background: #ffffff;
  box-shadow: 0px 1px 1px #efefef;
  opacity: 1;
  border-radius: 8px;
  margin: 8px 0 4px 0;
  .image {
    width: 170px;
    height: 170px;
    // background: #ffc9e1;
    opacity: 1;
  }
}

.componet {
  height: 100%;
  margin-top: -48px;
  background: #f3f3f3;
  opacity: 1;
  border-radius: 16px 16px 0px 0px;
  .tabge {
    width: 100%;
    padding-top: 65px;
    margin-bottom: 60px;
  }
}

.swipe {
  width: 350px;
  height: 148px;
  margin-left: 13px;
  margin-top: -130px;
  .my-swipe {
    color: #fff;
    font-size: 20px;
    text-align: center;
    border-radius: 10px;
  }
}
.box {
  width: 100%;
  height: 48px;
  background: linear-gradient(180deg, #fee5e1 0%, #e4a8a5 100%);
  line-height: 48px;
  position: fixed;
  z-index: 99999;
}
.home {
  width: 100%;
  height: 191px;
  background: linear-gradient(180deg, #fee5e1 0%, #e4a8a5 100%);
  opacity: 1;
}
.img {
  width: 56px;
  height: 28px;
  margin-left: 12px;
  line-height: 1.77667rem;
}
.search {
  margin-left: 70px;
  width: 278px;
  margin-top: -60px;
  height: 38px;
  background: #ffffff;
  border: 1px solid #ec6033;
  opacity: 1;
  border-radius: 42px;
}
</style>
