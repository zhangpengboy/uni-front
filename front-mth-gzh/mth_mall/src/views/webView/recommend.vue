<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="onLoad"
      >
        <div class="componet">
          <div
            class="imgList"
            v-for="item in list"
            :key="item.id"
            @click="toDity(item)"
          >
            <div>
              <van-image
                style="border-radius: 4px;margin-top: 0.32432rem;border-radius: 0.21621rem;
  overflow: hidden;"
                width="120"
                height="108"
                :src="item.goodsIcon"
              />
            </div>
            <div style="margin-top:0.32432rem;">
              <div class="text">{{ item.goodsName }}</div>
              <div class="texttwo">
                <span>{{ item.goodsTitle }}</span>
              </div>
              <!-- <div > -->
              <span class="textbuttom">￥</span
              ><span class="textbuttoms">{{ item.salePrice }}</span
              ><span
                style="font-size:10px;color: #eb6133;"
                v-if="item.integralType == 0"
              >
                + </span
              ><span v-else style="font-size:10px;color: #eb6133;"> 送 </span
              ><span style="color: #eb6133;">{{ item.integral }}</span
              ><span style="font-size:8px;color: #eb6133;">礼券</span
              ><del class="buttoms">{{ item.marketPrice }}</del>
              <!-- </div> -->
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
      goodsBrandFlag: ''
    }
  },
  created () {
    this.actCodeObj = this.$lance.getJson('items')
    this.goodsBrandFlag = this.$route.query.goodsBrandFlag
    // this.getHomeGoodsList()
  },

  methods: {
    onLoad () {
      // this.accountId = this.$lance.getData('accountId')
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      let url = null
      if (this.goodsBrandFlag === 'brand') {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10
        }
        url = this.$apiUri.APP_GOODSACT_PAGELISTMALL_V2
      } else {
        this.queryParams.actCode = this.actCodeObj.code
        url = this.$apiUri.APP_LISTMALL
      }

      this.loading = true
      this.$http.post(url, this.queryParams, res => {
        if (this.finished) return
        if (this.goodsBrandFlag === 'brand') {
          this.list = _.concat(this.list, res.data.list)
        } else {
          this.list = _.concat(this.list, res.data.list)
        }
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
      err => {
        this.loading = false
        this.finished = true
        this.$toast(err.message)
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
.componet {
  width: 351px;
  margin: 12px;
  background-color: #fff;
  border-radius: 8px;
  .imgList {
    margin: 12px 12px 16px 12px;
    display: flex;
    background-color: #fff;
  }
  .text {
    margin-left: 12px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
  .texttwo {
    margin-left: 12px;
    font-size: 12px;
    font-weight: 300;
    color: #999999;
    margin-bottom: 28px;
  }
  .textbuttom {
    margin-left: 12px;
    color: #eb6133;
    font-size: 10px;
  }
  .textbuttoms {
    color: #eb6133;
    font-size: 16px;
    font-weight: 500;
  }
  .buttoms {
    font-size: 11px;
    font-weight: 300;
    color: #999999;
    margin-left: 8px;
  }
}
</style>
