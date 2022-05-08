<template>
  <div>
    <!-- <van-nav-bar
      v-if="ShowBarFlag"
      :title="$route.meta.title"
      :right-text="$route.meta.text"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    /> -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="onLoad"
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
                  style="border-radius: 8px 8px 0 0;
  overflow: hidden;"
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
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      queryParams: {
        actCode: '',
        pcode: 'mth_tcwbuu5v',
        pageNum: 1,
        pageSize: 10
      },
      actCodeObj: {},
      index: ''
    }
  },

  created () {
    this.actCodeObj = this.$lance.getJson('actCode')
    this.index = this.$route.query.index
    this.onLoad()
  },

  methods: {
    onLoad () {
      // this.accountId = this.$lance.getData('accountId')
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      this.queryParams.actCode = this.actCodeObj.code
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
    },
    onRefresh () {
      // 清空列表数据
      this.finished = false
      this.queryParams.pageNum = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 点击跳转商品详情
    toDity (e) {
      // this.$lance.setJson('dataLp', e)
      // console.log(e)
      // console.log(this.index)
      // const bsType = this.index === '3' ? 'BS_A008' : 'BS_A001'
      const bsType = e.actCode === 'mth_l3kra9zp' ? 'BS_A008' : 'BS_A001'
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: e.id,
          bsType: bsType
        }
      })
    }
    // 商品列表
    // getHomeGoodsList () {
    //   this.queryParams.actCode = this.actCodeObj.code
    //   this.$http.post(this.$apiUri.APP_LISTMALL, this.queryParams, res => {
    //     if (res.success) {
    //       this.list = res.data.list
    //     }
    //   })
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
    opacity: 1;
    border-radius: 8px 8px 0px 0px;
  }
}

.componet {
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
  height: 48px;
  background: linear-gradient(180deg, #fee5e1 0%, #e4a8a5 100%);
  line-height: 48px;
  position: fixed;
  z-index: 99999;
}
.home {
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
