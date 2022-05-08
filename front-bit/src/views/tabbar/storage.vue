<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : 存储挖矿
-->
<template>
  <div class="withdraw-way">
    <div class="home-row">
      <div class="home-bg">
        <div class="but" :class="{ active: isCHIAActive }" @click="switchover('CHIA')">CHIA</div>
        <div class="but" :class="{ active: isIPFSActive }" @click="switchover('IPFS')">IPFS</div>
        <!-- <div class="but" :class="{ active: isUnionActive }" @click="switchover('union')">联合矿机</div> -->
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
      <div class="main-wrap" v-for="(v,i) in list" :key="i" @click="toGoodsInfo(v)" style="box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16)">
        <div class="title"><span class="name_left">{{ v.productName }}</span><div class="chia_but_right">{{ v.machineType === 6 ? 'CHIA' : 'IPFS' }}</div></div>
        <div class="number">
          <span class="num_span">剩余份数</span> <span class="spanblue"> {{ v.num }} 份</span>
          <div class="prog">
            <div class="prog-pivot" :style="countRemainNum(v)"></div>
          </div>
        </div>
        <div class="price">
          <div class="price_left">
            <p class="num_span">产品售价</p>
            <p class="price_p">{{ v.price }} CNY</p>
            <!-- <p class="num_span">
              <span> ≈ </span>
              <span>{{ v.price }} CNY</span>
            </p> -->
          </div>
          <div class="price_right">
            <p class="num_span">产品周期</p>
            <p class="price_right_P">{{ v.serviceTime === '-1' ? '永久产权' : `${v.serviceTime }天`}}</p>
          </div>
        </div>
        <div class="botTime">
          <p class="bot_yield">
            <span class="num_span">预计日收益</span>
            <span class="bot_spanD">请参考主网24小时平均挖矿收益</span>
          </p>
          <p class="bot_yield">
            <span class="num_span">上架期</span>
            <span class="bot_spanX">{{ v.prepareTime }}天交付</span>
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
      isCHIAActive: true,
      isIPFSActive: false,
      // isUnionActive: false,
      storageType: '6',
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        machineType: '6', // 1>比特币矿机;2>以太币矿机;3>比特币算力;4>以太币算力;5>FIL算力;6>XCH算力'
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    storageType: function (newV) {
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
  mounted () {
    this.getGoodsList()
  },
  methods: {
    // 切换存储挖矿类型
    switchover (e) {
      if (e === 'CHIA') {
        this.isCHIAActive = true
        this.isIPFSActive = false
        this.storageType = '6'
      }
      if (e === 'IPFS') {
        this.isCHIAActive = false
        this.isIPFSActive = true
        this.storageType = '5'
      }
    },
    /** 计算当前计算机剩余量 */
    countRemainNum (v) {
      return {
        width: (v.num / v.allNum) * 100 + '%'
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
      this.$router.push({
        name: 'goodsStorageInfo',
        query: {
          productNo: v.productNo
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$storageNumColor: linear-gradient(270deg, #FB8E44 0%, #F6B027 100%);
$storageNumBGColor: #EEF4FF;
$fontColor: #1E74E4;
.withdraw-way {
  .home-row {
    padding-top: 0;
      .home-bg {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 36px;
        padding: 4px 8px;
        background-color: #fff;
        border-radius: 8px;
        .but {
            width: 160px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            color: #CFCFCF;
            font-size: 15px;
        }
        .active {
            color: $fontColor;
            background-color: #EEF4FF;
            border-radius: 8px;
        }
      }
  }
}

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
      font-weight: 500;
    }
    .chia_but_right {
      width: 38px;
      height: 22px;
      font-size: 13px;
      color: #fff;
      text-align: center;
      line-height: 22px;
      background-color: #F6B027;
      border-radius: 4px;
    }
  }
  .number {
    margin: 16px 0;
    .spanblue {
      font-size: 13px;
      color: $fontColor;
    }
    .prog {
      width: 100%;
      height: 6px;
      background: $storageNumBGColor;
      border-radius: 8px;
      margin: 8px 0;
      .prog-pivot {
        height: 6px;
        background: $storageNumColor;
        border-radius: 8px;
      }
    }
  }
  .num_span {
    font-size: 13px;
    color: #999;
  }
  .price {
    display: flex;
    justify-content: space-between;
    .price_left {
      .price_p {
        font-size: 18px;
        color: $fontColor;
        margin: 8px 0;
      }
    }
    .price_right {
      text-align: right;
      .price_right_P {
        margin-top: 8PX;
        font-weight: 600;
      }
    }
  }
  .botTime {
    width: 100%;
    height: 60px;
    background-color: #EEF4FF;
    border-radius: 5px;
    margin-top: 10px;
    padding: 8px;
    .bot_yield {
      display: flex;
      justify-content: space-between;
      color: #333;
      margin-bottom: 10px;
      font-size: 13px;
      .bot_spanD {
        font-weight: 600;
      }
    }
  }
}
</style>
