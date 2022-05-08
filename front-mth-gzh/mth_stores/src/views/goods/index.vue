<!-- 商品管理-->
<template>
  <div class="goods">
    <van-nav-bar :title="$route.meta.title"
                 left-arrow
                 fixed
                 placeholder
                 @click-left="onClickLeft" />
    <div class="center"
         v-for="(item, index) in data.slice(0,2)"
         :key="index">
      <div class="d-flex justify-content-between mb-3">
        <span class="fs-16 color-text fw-700">{{ item.name }}</span>
        <div class="add"
             @click="onClickRight(index)">
          <van-icon name="plus"
                    size="12"
                    color="#EB6133" />
        </div>
      </div>
      <div class="d-flex flex-row justify-content-around">
        <div v-for="(v, i) in item.count"
             :key="i"
             @click="toPage(index, v.status)">
          <p class="fs-20 color-text fw-700 mt-2 text-center">{{ v.num }}</p>
          <p class="my-2">
            <span class="fs-13 color-light pr-1">{{
              i | filterGoodslType
            }}</span>
            <van-icon name="arrow"
                      size="10"
                      color="#999" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      data: [],
      storeId: '',
      goodsClassify: ['商城商品', '街市商品', '店铺商品']
    }
  },
  created () {
    this.storeId = this.$lance.getData('storeId')
    // this.getGoodsCount()
  },
  activated () {
    this.getGoodsCount()
  },
  methods: {
    // 获取商品统计
    getGoodsCount () {
      this.data = []
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_COUNT,
        { storeId: this.storeId },
        res => {
          res.data.forEach((element, i) => {
            if (element) {
              this.data.push({
                name: this.goodsClassify[i],
                count: [
                  { status: 0, num: element.notCheckGoodsCount },
                  { status: 2, num: element.notUpGoodsCount },
                  { status: 3, num: element.saleGoodsCount },
                  { status: 5, num: element.rejectGoodsCount }
                ]
              })
            }
            // else {
            //   this.data.push({
            //     name: this.goodsClassify[i],
            //     count: [{ status: 0, num: 0 }, { status: 2, num: 0 }, { status: 3, num: 0 }, { status: 5, num: 0 }]
            //   })
            // }
          })
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    onClickLeft () {
      this.$router.push('storeSelect')
    },
    onClickRight (index) {
      if (index === 0) {
        this.$router.push('addGoodsBase')
      }
      if (index === 1) {
        this.$router.push('addStreetGoodsIndex')
      }
      if (index === 2) {
        this.$router.push('addStoreGoodsBase')
      }
    },
    /* 前往指定url页面 */
    toPage (index, i) {
      this.$router.push({
        path: 'shoppingGoods',
        query: {
          status: i,
          goodsType: index
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.goods {
  padding: 12px;
  .center {
    width: 100%;
    height: 128px;
    background: #ffffff;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    .add {
      width: 22px;
      height: 22px;
      background: #ffeee8;
      border-radius: 4px;
      line-height: 22px;
      text-align: center;
    }
  }
}
</style>
