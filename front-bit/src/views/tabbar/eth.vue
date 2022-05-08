<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : ETH 专区
-->
<template>
  <div class="home">
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="我是有底线的"
      :immediate-check="false"
      @load="getGoodsList"
    >
    <div class="home-row" v-for="(v,i) in list" :key="i" @click="toGoodsInfo(v)">
      <div class="home-img"><van-image :src="v.img" fit="cover"  /></div>
      <div class="home-info">
        <h1 class="title">{{v.productName}}</h1>
        <p class="desc">
          <span>算力:</span>
          <span>{{v.hash}} {{v.hashUnit}}</span>
          <span class="px-2">|</span>
          <span>功耗:</span>
          <span>{{v.power}} {{v.powerUnit}}</span>
        </p>
        <p class="output">
          <span>预计日产出：</span>
          <span>{{v.dayCny}} CNY/台</span>
        </p>
        <p class="cny">
          <span class="mr-1">{{v.price}}</span>
          <span class="fs-13">CNY</span>
        </p>
        <div class="number">
          <div class="prog">
            <div class="prog-pivot" :style="countRemainNum(v)"></div>
          </div>
          <div class="remain">
            <span class="mr-2">剩余:</span>
            <span class="color-main">{{v.num}}</span>
            <span>台</span>
          </div>
        </div>
      </div>
    </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        machineType: '2', // 1>比特币矿机;2>以太币矿机;3>比特币算力;4>以太币算力;5>FIL算力;6>XCH算力'
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    /** 计算当前计算机剩余量 */
    countRemainNum (v) {
      return {
        width: (v.num / 1000) * 100 + '%'
      }
    },
    /** 获取商品列表 */
    getGoodsList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_PRODUCT_LIST,
        this.queryParams,
        (res) => {
          if (this.finished) return
          this.list = _.concat(this.list, res.data.list)
          this.loading = false
          if (res.data.totalPage === 0 || res.data.totalPage === this.queryParams.pageNum) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        }
      )
    },
    /** 页面跳转 */
    toGoodsInfo (v) {
      this.$router.push({
        name: 'goodsInfo',
        query: {
          productNo: v.productNo
        }
      })
    }
  }
}
</script>
