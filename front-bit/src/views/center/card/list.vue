<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-08 16:18:39
 * @Description : 银行卡列表
-->
<template>
  <div class="center cards">
    <van-nav-bar
      title="收/付款设置"
      left-arrow
      @click-left="$baseUtils.goBack()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon
          name="plus"
          size="18"
          class="color-main fw-b"
          @click="show = true"
        />
      </template>
    </van-nav-bar>

    <!-- 列表 -->
    <div class="main-wrap mt-2 color-bit1" v-for="(v, i) in list" :key="i">
      <div class="main-wrap-cont cards-item">
        <div class="pt-1 fs-14">CNY</div>
        <div class="flex-1 pt-1 ml-2">
          <h2 class="fs-14 mb-2">{{ v.cardName | filterCardName }}</h2>
          <p class="fs-12 van-ellipsis">
            {{ v.bankName }}（{{ v.cardNo | filterCardNo }}）
          </p>
        </div>
        <van-image
          :src="require('@/assets/images/center/bank-cny@2x.png')"
          height="64"
          width="64"
          fit="contain"
        />
      </div>
    </div>
    <div
      class="main-wrap mt-2"
      :class="'color-bit' + v.bitType"
      v-for="(v, i) in walletList"
      :key="(i + 1) * 10"
    >
      <div class="main-wrap-cont cards-item" @click="toPage('bindWallet', v.bitType)">
        <div class="pt-1 fs-14">{{ v.bitType | filterBitType }}</div>
        <div class="flex-1 pt-1 ml-2">
          <h2 class="fs-14 mb-2">{{ v.bitType | filterBitType }} 地址</h2>
          <p class="fs-12 van-ellipsis">
            {{ v.walletAddress }}
          </p>
        </div>
        <van-image
          :src="require(`@/assets/images/center/bank-bit${v.bitType}@2x.png`)"
          height="64"
          width="64"
          fit="contain"
        />
      </div>
    </div>

    <!-- 底部弹窗 -->
    <van-action-sheet
      v-model="show"
      :close-on-click-overlay="false"
      title="添加收款方式"
    >
      <van-cell-group class="pb-2">
        <van-cell
          title="银行卡"
          size="large"
          clickable
          @click="toPage('bindBank')"
        />
        <!-- <van-cell title="微信" size="large" clickable /> -->
        <!-- <van-cell title="支付宝" size="large" clickable /> -->
        <van-cell
          title="BTC地址"
          size="large"
          clickable
          @click="toPage('bindWallet', '2')"
        />
        <van-cell
          title="ETH地址"
          size="large"
          clickable
          @click="toPage('bindWallet', '3')"
        />
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      list: [],
      walletList: []
    }
  },
  activated () {
    this.getBitCardList()
  },
  methods: {
    /** 获取绑定卡列表 */
    getBitCardList () {
      this.$http.post(this.$apiUri.APP_BIT_CARD_LIST, null, (res) => {
        this.list = res.data
        this.getWalletList()
      })
    },
    /** 获取钱包列表 */
    getWalletList () {
      this.$http.post(this.$apiUri.APP_CARD_WALLET_GET, null, (res) => {
        this.walletList = res.data
      })
    },
    /** 跳转页面 */
    toPage (name, bitType) {
      this.show = false
      this.$router.push({ name, query: { bitType } })
    }
  }
}
</script>
