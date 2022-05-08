<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : 联合挖矿
-->
<template>
  <div class="home">
    <div class="home-row">
      <div class="home-bg">
        <div class="but" :class="{ active: isActive }" @click="switchover('BTC')">BTC专区</div>
        <div class="but" :class="{ active: !isActive }" @click="switchover('ETH')">ETH专区</div>
      </div>
    </div>
    <template v-if="isShow === 'BTC'">
      <BTC />
    </template>
    <template v-if="isShow === 'ETH'">
      <ETH />
    </template>
  </div>
</template>

<script>
import BTC from './btc'
import ETH from './eth'

export default {
  components: {
    BTC,
    ETH
  },
  data () {
    return {
      isShow: 'BTC',
      isActive: true
    }
  },
  mounted () {},
  methods: {
    switchover (e) {
      // console.log(e)
      if (e === 'BTC') {
        this.isShow = 'BTC'
        this.isActive = true
      }
      if (e === 'ETH') {
        this.isShow = 'ETH'
        this.isActive = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  .home-bg {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 36px;
    // margin-top: 18px;
    padding: 4px 8px;
    background-color: #EEF4FF;
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
        color: #1E74E4;
        border: 1px solid #fff;
        background-color: #fff;
        border-radius: 8px;
    }
  }
}
</style>
