<!-- 我要批 -->
<template>
  <div class='purchase'>
    <van-nav-bar
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    >
      <template #title>
        <!-- <van-search v-model="value" placeholder="搜索商品名称" shape="round"/> -->
        <form action="/">
          <van-search
            v-model="value"
            placeholder="搜索商品名称"
            shape="round"
            @search="onSearch"
          />
        </form>
      </template>
    </van-nav-bar>
    <van-sidebar v-model="activeKey">
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
      <van-sidebar-item title="标签名称" />
    </van-sidebar>
        <van-list
      v-if="dataOK || orderList.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getOrderList"
      class="center"
    >
      <div
        class="card"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <div @click="toOrderDetails(item)">
          <div class="d-flex">
            <img class="goods-thumb" :src="item.goodsSkuIcon" alt="">
            <div class="goodsInfo">
              <p class="title">{{ item.goodsName }}</p>
              <p class="d-flex justify-content-between my-2">
                <span class="guige">{{ item.goodsSkuName }}</span>
                <span class="fs-13 color-light">{{ `x${item.goodsNum}` }}</span>
              </p>
              <div class="price text-price">
                <span>{{ item.salePrice }}</span>
                <template v-if="item.integral > 0">
                  <span class="text-xs">{{
                    item.integralType | filterIntegralType
                  }}</span>
                  <span>{{ item.integral }}</span>
                  <span class="text-xs">{{ $lance.getIntegralName() }}</span>
                </template>
                <span class="text-marketPrice">{{ `¥ ${item.marketPrice}` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_goods@2x.png')"
      description="暂无商品"
    />
  </div>
</template>

<script>
export default {
  name: 'purchase',
  data () {
    return {
      value: '',
      activeKey: '',
      loading: false,
      finished: false,
      goodsList: [],
      dataOK: true
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onSearch () {

    },
    getOrderList () {

    },
    toOrderDetails (v) {}
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.purchase {
  /deep/ .van-nav-bar__title {
    font-weight: 300;
    max-width: 100%;
    .van-search {
      padding: 0;
    }
  }
    .center {
    padding: 12px;
  }
  .card {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
    .goods-thumb {
      width: 94px;
      height: 94px;
      border-radius: 4px;
      margin-right: 12px;
    }
    .goodsInfo {
      // min-width: 210px;
      // max-width: 240px;
      width: 230px;
    }
    .title {
      font-size: 14px;
      color: #333;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .guige {
      // max-width: 120px;
      height: 20px;
      font-size: 10px;
      background: #F2F2F2;
      border-radius: 4px;
      color: #666;
      text-align: center;
      padding: 3px 6px;
    }
    .line {
      width: 1px;
      height: 14px;
      background: #EEEEEE;
      margin: 0 8px;
    }
  }
}
</style>
