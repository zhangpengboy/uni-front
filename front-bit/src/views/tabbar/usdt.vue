<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : 算力专区
-->
<template>
  <div class="home">
    <div class="home-row">
      <div class="home-title">
        <div class="title_name_left">
          <img src="@/assets/images/tabbar/zu_1151@1x.png" alt="">
          <p class="title_name">算力租赁</p>
        </div>
        <p class="title_name_right">租金不可退</p>
      </div>
      <div class="home-bg">
        <div class="but" :class="{ active: isActive }" @click="switchover('BTC')">BTC专区</div>
        <div class="but" :class="{ active: !isActive }" @click="switchover('ETH')">ETH专区</div>
      </div>
    </div>
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="我是有底线的"
      :immediate-check="false"
      @load="getGoodsList"
    >
      <div class="main-wrap" v-for="(v,i) in list" :key="i" @click="toGoodsInfo(v)">
        <div class="title">
          <span class="name_left" :class="[ v.num === 0 ? 'disabled' : '' ]">{{ v.productName }}</span>
          <div class="chia_but_right" :class="[ v.num === 0 ? 'disabled' : '' ]">
            剩余 {{ v.num }} 份
          </div>
        </div>
        <div class="price">
          <div class="price_left">
            <p class="num_span">产品售价</p>
            <p class="price_p">
              <span>{{ v.price }} CNY</span>
              <!-- <span class="num_span"> ≈ </span>
              <span class="num_span">{{ v.price }} USDT</span> -->
              </p>
          </div>
          <div class="price_right" v-if="v.num > 0">
            <p class="num_span">产品周期</p>
            <p class="price_right_P">{{ v.serviceTime === '-1' ? '永久产权' : `${v.serviceTime}天` }} </p>
          </div>
          <div v-else>
            <img src="@/assets/images/goods/sold_out@1x.png" alt="">
          </div>
        </div>
        <div class="botTime">
            <img src="@/assets/images/tabbar/icon_expend@2x.png" alt="">
            <span class="num_span_left">预计日产出</span>
            <span class="num_span_right"> ≈</span>
            <span class="num_span_right">{{ v.dayUsdt }} USDT</span>

        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isActive: true,
      usdtType: '3',
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        machineType: '3', // 1>比特币矿机;2>以太币矿机;3>比特币算力;4>以太币算力;5>FIL算力;6>XCH算力'
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    usdtType: function (newV) {
      this.list = []
      this.finished = false
      this.queryParams = _.assign(
        {},
        {
          machineType: newV,
          pageNum: 1,
          pageSize: 5
        }
      )
      this.getGoodsList()
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    switchover (e) {
      if (e === 'BTC') {
        this.isActive = true
        this.usdtType = '3'
      }
      if (e === 'ETH') {
        this.isActive = false
        this.usdtType = '4'
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
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }

          this.queryParams.pageNum++
        }
      )
    },
    /** 页面跳转 */
    toGoodsInfo (v) {
      if (v.num === 0) {
        return this.$toast('产品已售罄')
      }
      this.$router.push({
        name: 'goodsUSDTInfo',
        query: {
          productNo: v.productNo
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  .num_span {
    height: 18px;
    font-size: 13px;
    line-height: 18px;
    color: #999;
    margin: 12px 0;
  }
  .home-row {
    display: flex;
    flex-direction: column;
    align-content:center;
    .home-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 36px;
      background:url("../../assets/images/tabbar/icon_zu@1x.png") no-repeat;
      background-size:cover;
      margin-bottom: 20px;
      .title_name_left {
        display: flex;
        align-items: center;
        img {
          margin: 8px 12px;
        }
        .title_name {
          font-size: 15px;
          font-weight: 600;
          color: #333333;
        }
      }

      .title_name_right {
        font-size: 13px;
        color: #999;
        margin-right: 12px;

      }
  }
  .home-bg {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    .but {
        width: 88px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #fff;
        font-size: 13px;
        border: 1px solid rgb(190,200,250);
        background-color: rgb(190,200,250);
        border-radius: 16px;
        margin-right: 10px;
    }
    .active {
        border: 1px solid rgb(40,130,250);
        background-color: rgb(40,130,250);

    }
  }
}

  .main-wrap {
    display: flex;
    flex-direction: column;
    align-content: center;
    border: 1px solid #F7F7F7;
    border-radius: 4px;
    padding: 16px 12px;
    .title {
      display: flex;
      justify-content: space-between;
      .name_left {
        font-size: 14px;
        color: #333;
        font-weight: 600;
      }
      .chia_but_right {
        height: 20px;
        color: #1E74E4;
        text-align: center;
        line-height: 20px;
        font-size: 13px;
      }
      .disabled {
        color: #CFCFCF;
      }
    }
    .price {
      display: flex;
      justify-content: space-between;
      .price_left {
        .price_p {
          font-size: 20px;
          color: #1E74E4;
          margin: 6px 0;
        }
      }
      .price_right {
        text-align: right;
        .price_right_P {
          font-size: 18px;
          margin-top: 10PX;
          color: #333333;
          font-weight: 600;
        }
      }
    }
    .botTime {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      height: 28px;
      background-color: #F5F5F5;
      border-radius: 24px;
      margin-top: 10px;
      margin-bottom: 10px;
      line-height: 28px;

      img {
          margin: 6px 10px 6px 12px;
        }
        .num_span_left {
          color: #999;
          font-size: 13px
        }
        .num_span_right {
          color: #333;
          padding: 0 2px;
          font-size: 13px
        }
    }
  }
}
</style>
