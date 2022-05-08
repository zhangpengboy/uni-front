<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="money">
        <div>
          <p>总金额&nbsp;&nbsp;&nbsp;(元)</p>
          <div class="moneyto">{{ allAmount }}</div>
        </div>
        <div class="moneybuttom">
          <div @click="toMoney">
            <p>可用金额&nbsp;&nbsp;&nbsp;(元)</p>
            <div class="moneyone">{{ freeAmount }}</div>
          </div>
          <div @click="toDjMoney" style="margin-left: 100px">
            <p>冻结金额&nbsp;&nbsp;&nbsp;(元)</p>
            <div class="moneyone">{{ frozenAmount }}</div>
          </div>
        </div>
      </div>

      <div style="background-color: #f7f7f7">
        <!-- <div class="paypal" @click="PayZFB">
          支付宝
          <van-icon name="arrow" />
          <span class="van-icon fs-16" v-if="aliaccount">已绑定</span>
          <span class="van-icon fs-16" v-if="!aliaccount">未绑定</span>
        </div>
        <div class="paypal" @click="dePosit">
          提现记录
          <van-icon name="arrow" />
        </div>
        <div class="paypal" @click="record">
          提现
          <van-icon name="arrow" />
          <span class="van-icon fs-16" >(可提现{{ freeAmount }}元)</span>
        </div> -->
        <van-cell title="支付宝" is-link :value="aliaccount"  @click="PayZFB"/>
        <van-cell title="提现记录" is-link  @click="dePosit"/>
        <van-cell title="提现" is-link :value="`可提现${freeAmount}元`"  @click="record"/>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data () {
    return {
      isLoading: false,
      indextype: false,
      aliaccount: '未绑定',
      allAmount: '', // 总金额
      freeAmount: '', // 可用金额
      frozenAmount: '', // 冻结金额
      storeId: ''
    }
  },
  // computed: {
  //   ...mapState(['shop'])
  // },
  created () {
    // this.storeList = this.$lance.getJson('storeList')
    this.storeId = this.$route.query.storeId ? this.$route.query.storeId : this.$lance.getData('storeId')
    this.$lance.setData('storeId', this.storeId)
    this.getMoneyInfo()
    this.getAlipayUser()
  },

  methods: {
    onClickLeft () {
      this.$router.push('/')
    },
    // 获取用户资产总数
    getMoneyInfo () {
      this.$toast.loading({ message: '加载中...', forbidClick: true })

      this.$http.post(
        this.$apiUri.APP_MONEY,
        {
          userId: this.storeId
        },
        res => {
          if (res.success) {
            this.allAmount = res.data.allAmount.toFixed(2).toString()
            this.freeAmount = res.data.freeAmount.toFixed(2).toString()
            this.frozenAmount = res.data.frozenAmount.toFixed(2).toString()
            this.accountId = res.data.accountId
            // this.getAlipayUser()
          }
        }
      )
    },
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
        this.getMoneyInfo()
        this.getAlipayUser()
      }, 1000)
    },

    // 根据账户获取绑定的支付宝账号
    getAlipayUser () {
      this.$http.post(
        this.$apiUri.APP_ADD_GET_ALIPAY,
        { userId: this.storeId },
        res => {
          if (res.data) {
            this.aliaccount = '已绑定'
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    toDjMoney () {
      this.$lance.setData('accountId', this.accountId)

      this.$router.push({ name: 'DjmoneyLog' })
    },
    toMoney () {
      this.$lance.setData('accountId', this.accountId)
      this.$router.push({ name: 'moneyLog' })
    },
    // 绑定支付宝
    PayZFB () {
      this.$lance.setData('storeId', this.storeId)
      if (this.aliaccount === '已绑定') {
        // 已绑定
        this.$router.push({ name: 'alipayInfo' })
      } else {
        // 未绑定
        this.$router.push({ name: 'alipayBind' })
      }
    },
    // 提现记录
    dePosit () {
      this.$lance.setData('accountId', this.accountId)

      // if (this.aliaccount) return this.$toast('未绑定支付宝')
      this.$router.push({ name: 'withdrawLog' })
    },
    // 提现
    record () {
      if (this.aliaccount === '未绑定') return this.$toast('未绑定支付宝')
      this.$router.push({ name: 'withdraw', query: { userId: this.storeId } })
    }
  }
}
</script>

<style lang="scss" scoped>
// span {
//   color: #f32e5c;
//   font-size: 14px;
// }
.van-cell__value {
  color: #f32e5c;
}
.paypal {
  width: 100%;
  height: 45px;
  margin-top: 10px;
  background: #fff;
  text-indent: 1em;
  font-size: 16px;
  line-height: 45px;
  .van-icon {
    float: right;
    margin-right: 5px;
    line-height: 45px;
    font-size: 18px;
  }
}
.money {
  background: #eb6132;
  height: 6rem;
  padding-left: 24px;
  padding-top: 35px;
  p {
    color: #fff;
    padding-bottom: 12px;
    font-size: 18px;
    font-weight: 400;
  }
}
.moneybuttom {
  display: flex;
}
.moneyone {
  color: #fff;
  font-size: 20px;
  font-weight: 400;
}
.moneyto {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 50px;
}
</style>
