<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-15 10:58:25
 * @Description : 钱包
-->
<template>
  <div class="center wallet">
    <van-nav-bar
      title="我的钱包"
      right-text="资金记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      placeholder
    />

    <div class="px-3 pt-4">
      <p class="fs-14 mb-2 d-flex align-items-center">
        <span class="mr-2">资产折合[CNY]</span>
        <template v-if="showMoney">
          <van-icon name="eye-o" size="15" @click.stop="onShowMoney(0)" />
        </template>
        <template v-else>
          <van-icon name="closed-eye" size="15" @click.stop="onShowMoney(1)" />
        </template>
      </p>
      <h1 class="fs-30 mb-4" v-if="showMoney">≈{{ allAmountCny }}</h1>
      <h1 class="fs-30 mb-4" v-else>·····</h1>
    </div>

    <div class="wallet-items main-wrap mb-10 radius-tlr-8">
      <van-cell-group :border="false">
        <template v-for="(v, i) in assets">
          <van-cell
            :title="v.bitType | filterBitType"
            size="large"
            class="py-4"
            :key="i"
            center
            v-show="i <= 4"
          >
            <template #icon>
              <van-icon
                :name="v.bitType | filterBitImg"
                size="24"
                class="mr-2"
              />
            </template>
            <template #default>
              <template v-if="showMoney">
                <p>{{ v.allAmount }}</p>
                <p class="fs-12 color-light" v-show="i > 0">
                  ≈{{ v.transCny || '0.00' }}
                </p>
              </template>
              <template v-else>
                <p>·····</p>
                <p class="fs-12 color-light" v-show="i > 0">·····</p>
              </template>
            </template>
          </van-cell>
        </template>
      </van-cell-group>
    </div>

    <!-- 底部 -->
    <!-- @click="
          show = true;
          actionType = 0;
        " -->
    <div class="footer-btn">
      <van-button
        block
        plain
        class="mr-2"
        type="info"
        @click="$router.push('withdraw')"
      >
        转出
      </van-button>
      <!--         @click="
          show = true;
          actionType = 1;
        " -->
      <van-button
        block
        class="ml-2"
        type="info"
        @click="$router.push('recharge')"
      >
        转入
      </van-button>
    </div>

    <!-- 转出\转入 action -->
    <van-action-sheet v-model="show" title="选择币种" close-on-popstate>
      <van-cell-group :border="false">
        <template v-for="(v, i) in assets">
          <van-cell
            :title="v.bitType | filterBitType"
            size="large"
            :key="i"
            center
            is-link
            @click="toPage(v.bitType)"
            v-if="i < 1"
          >
            <template #icon>
              <van-icon
                :name="v.bitType | filterBitImg"
                size="24"
                class="mr-2"
              />
            </template>
            <template #label>
              <p class="fs-12">
                余额：{{ v.freeAmount }}{{ v.bitType | filterBitType }}
              </p>
            </template>
          </van-cell>
        </template>
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>
<script>
import Decimal from 'decimal.js-light'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      showMoney: false,
      assets: [],
      show: false,
      actionType: null, // 0-转出 1-转入
      allAmountCny: 0 // 折合CNY
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    this.showMoney = !!+this.$lance.getData('show-money')
  },
  activated () {
    this.allAmountCny = 0
    this.getUserMoney()
  },
  methods: {
    /** 获取资金列表 */
    getUserMoney () {
      this.$http.post(this.$apiUri.APP_ASSETS_GET, null, (res) => {
        this.assets = res.data
        console.log(this.assets)
        _.each(this.assets, (v, i) => {
          if (i < 3) {
            this.getWithdrawMin(v.bitType, i)
          }
        })
      })
    },
    /** 返回 */
    onClickLeft () {
      this.$router.back()
    },
    /** 交易记录 */
    onClickRight () {
      this.$router.push('walletList')
    },
    /** 跳转页面 */
    toPage (bitType) {
      this.show = false
      if (this.actionType === 0) {
        // 转出
        switch (bitType) {
          case 1:
            this.$router.push('withdraw')
            break
          case 2:
          case 3:
            this.$router.push({ name: 'bitOut', query: { bitType } })
            break
        }
      }
      if (this.actionType === 1) {
        // 转入
        switch (bitType) {
          case 1:
            this.$router.push('recharge')
            break
          case 2:
          case 3:
            this.$router.push({ name: 'bitIn', query: { bitType } })
            break
        }
      }
    },
    /** 显示隐藏 */
    onShowMoney (bl) {
      this.$lance.setData('show-money', bl)
      this.showMoney = !!bl
    },
    /** 获取当前类型最小提现 */
    getWithdrawMin (bitType, index) {
      this.$http.post(this.$apiUri.APP_WITHDRAW_MIN, { bitType }, (res) => {
        if (res.success && res.data) {
          const transCny = Decimal(res.data.cnyTrans)
            .mul(this.assets[index].freeAmount)
            .toFixed(2)
          this.$set(this.assets[index], 'transCny', transCny)
          this.allAmountCny = Decimal(this.allAmountCny)
            .add(transCny)
            .toNumber()
        }
      })
    }
  }
}
</script>
