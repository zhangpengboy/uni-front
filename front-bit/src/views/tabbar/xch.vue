<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : XCH 专区
-->
<template>
  <div class="withdraw-way">
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
      @load="getGoodsList"
    >
    <!-- <div class="home-row" v-for="(v,i) in list" :key="i" @click="toGoodsInfo(v)">
      <div class="home-img"><van-image :src="require('@/assets/images/product/btc-product@2x.png')" fit="cover"  /></div>
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
    </div> -->
      <div class="main-wrap" v-for="(v,i) in list" :key="i" @click="toGoodsInfo(v)" style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)">
        <div class="title"><span class="name_left">{{ v.productName }}</span><div class="chia_but_right">CHIA</div></div>
        <div class="number">
          <span class="num_span">剩余分数 {{ v.num }} 份</span>
          <div class="prog">
            <div class="prog-pivot" :style="countRemainNum(v.num)"></div>
          </div>
        </div>
        <div class="price">
          <div class="price_left">
            <p class="num_span">产品售价</p>
            <p class="price_p">{{ v.price }} USDT</p>
            <p class="num_span">
              <span> ≈ </span>
              <span>{{ v.price }} CNY</span>
            </p>
          </div>
          <div class="price_right">
            <p class="num_span">产品周期</p>
            <p class="price_right_P">{{ v.serviceTime === '-1' ? '永久产权' : v.serviceTime }}</p>
          </div>
        </div>
        <div class="botTime">
          <p class="bot_yield">
            <span class="num_span">预计日收益</span>
            <span class="bot_spanD">请参考主网24小时平均挖矿收益</span>
          </p>
          <p class="bot_yield">
            <span class="num_span">上架期</span>
            <span class="bot_spanX">{{ v.time }}天交付</span>
          </p>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [{
        productName: 'CHIA先锋矿机（16T）第三期',
        num: 285,
        price: 9999.34,
        serviceTime: '-1',
        time: 30
      }],
      loading: false,
      finished: false,
      queryParams: {
        bitType: '5', // 2-BTC 3-ETH 5-XCH
        machineType: '6', // 1>比特币矿机;2>以太币矿机;3>比特币算力;4>以太币算力;5>FIL算力;6>XCH算力'
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
        width: (v / 1000) * 100 + '%'
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
        name: 'goodsXCHInfo',
        query: {
          productNo: v.productNo
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-wrap {
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    .name_left {
      font-size: 14px;
      color: #333;
    }
    .chia_but_right {
      width: 45px;
      height: 20px;
      color: #fff;
      text-align: center;
      line-height: 20px;
      background-color: rgb(229,163,10);
      border: 1px solid rgb(229,163,10);
      border-radius: 4px;
    }
  }
  .number {
    margin: 12px 0;
    .prog {
      width: 100%;
      height: 4px;
      background-color: rgb(172, 169, 169);
      border-radius: 4px;
      margin: 4px 0;
      .prog-pivot {
        height: 4px;
        background-color: rgb(229,163,10);
        border-radius: 4px;
      }
    }
  }
  .num_span {
    font-size: 10px;
    color: #666;
  }
  .price {
    display: flex;
    justify-content: space-between;
    .price_left {
      .price_p {
        font-size: 20px;
        color: rgb(53, 75, 223);
        margin: 6px 0;
      }
    }
    .price_right {
      text-align: right;
      .price_right_P {
        margin-top: 10PX;
      }
    }
  }
  .botTime {
    width: 100%;
    height: 60px;
    background-color: rgb(237,244,255);
    border-radius: 5px;
    margin-top: 10px;
    padding: 8px;
    .bot_yield {
      display: flex;
      justify-content: space-between;
      color: #333;
      margin-bottom: 10px;
      .bot_spanD {
        font-size: 14px;
      }
      .bot_spanX {
        font-size: 10px;
      }
    }
  }
}
</style>
