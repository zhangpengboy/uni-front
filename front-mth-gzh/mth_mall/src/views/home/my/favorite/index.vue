<template>
  <div class="faver">
    <van-list
      v-if="dataOK || list.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getFaverGoodsList"
    >
      <!-- 收藏列表 -->
      <div
        class="main-wrap"
        v-for="(v, i) in list"
        :key="i"
        @click="jumpGoodsDetail(v)"
      >
        <div class="main-wrap-box">
          <div class="faver-content">
            <div class="faver-img">
              <img :src="v.goodsIcon" mode="aspectFill" />
            </div>
            <div class="faver-desc">
              <div class="title">{{ v.goodsName }}</div>
              <div class="price text-price text-main">
                <span>{{ v.salePrice }}</span>
                <template v-if="v.integral > 0">
                  <span class="text-xs">{{
                    v.integralType | filterIntegralType
                  }}</span>
                  <span>{{ v.integral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
                <span class="text-marketPrice">{{ `¥ ${v.marketPrice}` }}</span>
              </div>
            </div>
          </div>
          <div class="faver-footer">
            <div class="cbtn" @click.stop="delFaverGoods(v.goodsId)">
              取消收藏
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_favorite@2x.png')"
      description="暂无收藏"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      finished: false,
      list: [],
      dataOK: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.getFaverGoodsList()
  },
  methods: {
    // 获取商品收藏列表
    getFaverGoodsList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_USERFAVORGOODS_GET,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
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
        },
        err => {
          this.loading = false
          this.dataOK = true
          this.$toast(err.message)
        }
      )
    },
    // 取消收藏
    delFaverGoods (goodsId) {
      this.$http.post(
        this.$apiUri.APP_FAVORDEL,
        {
          workId: goodsId
        },
        res => {
          // this.$router.go(0)
          this.$toast('已取消收藏')
          this.queryParams.pageNum = 1
          this.finished = false
          this.dataOK = true
          this.list = []
          this.getFaverGoodsList()
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 商品详情
    jumpGoodsDetail (v) {
      this.$router.push({
        path: '/commodity',
        query: {
          dataIP: v.goodsId,
          bsType: v.bsType || 'BS_A001',
          uuid: v.saleUuid
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.faver {
  padding-top: 15px;

  &-content {
    display: flex;
  }

  &-img {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-desc {
    flex: 1;
    margin-left: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-size: 14px;
      color: #333;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      font-size: 16px;
      font-weight: 700;
    }
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
    .cbtn {
      border: 1px solid #c1c1c1;
    }
  }
}
</style>
