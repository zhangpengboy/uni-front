<template>
  <div class="myWallet">
    <van-nav-bar
      title="我的钱包"
      right-text="明细"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div class="myCd">
      <div class="assets">
        <div class="myAssets">我的资产</div>
        <!-- <div class="particulars" @click="goTheDeatil">明细</div> -->
      </div>
      <div class="balance">余额 (元)</div>
      <div class="amount">{{ userMoney.allAmount }}</div>
      <!-- <div class="number">
        <div class="available">
          <div class="balance">{{ userMoney.freeAmount }}</div>
          <div class="amount">可用余额</div>
        </div>
        <div class="freeze">
          <div class="balance">{{ userMoney.frozenAmount }}</div>
          <div class="amount">冻结余额</div>
        </div>
      </div> -->
    </div>
    <div class="operation">
      <div class="canWith">可提现余额 (元) : {{ userMoney.freeAmount }}</div>
      <div>
        <van-button @click="withdraws" class="btn" type="primary" size="small"
          >提现</van-button
        >
      </div>
    </div>
    <div class="pay" @click="binding">
      <van-cell v-if="aliaccount" title="支付宝" is-link value="(未绑定)" />
      <van-cell v-else title="支付宝" is-link value="(已绑定)" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      userMoney: {},
      aliaccount: false,
      MoneyList: [],
      loading: false,
      finished: false,
      dataOK: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        actCode: ''
      }
    }
  },
  computed: {
    ...mapState(['userWeixinInfo'])
  },
  created () {
    // console.log(11111, this.userWeixinInfo.id)

    this.getMoney()
    this.getAlipayUser()
  },
  methods: {
    // 根据账户获取绑定的支付宝账号
    getAlipayUser () {
      this.$http.post(
        this.$apiUri.APP_ADD_GET_ALIPAY,
        { userId: this.userWeixinInfo.id },
        res => {
          if (res.success) {
            if (res.data == null) {
              this.aliaccount = true
            }
            if (res.data.id) {
              this.aliaccount = false
            }
          }
        }
      )
    },
    binding () {
      if (!this.aliaccount) {
        // 绑定
        this.$router.push({ name: 'isBindZFB' })
      } else {
        // 未绑定
        this.$router.push('/bindingZFB')
      }
    },
    withdraws () {
      if (this.aliaccount) return this.$toast('未绑定支付宝')
      this.$router.push('/withdraw')
    },
    onClickRight () {
      // if (this.aliaccount) return this.$toast('未绑定支付宝')
      this.$router.push('/detail')
    },
    onClickLeft () {
      this.$router.push('/my')
    },
    getMoney () {
      this.$http.post(
        this.$apiUri.APP_USERMONEYINFO,
        {},
        res => {
          this.userMoney = res.data
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.van-cell__left-icon,
.van-cell__right-icon {
  height: 0.64rem;
  font-size: 0.42667rem;
  line-height: 33px;
}
.van-cell {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0.42667rem;
  overflow: hidden;
  color: #333333;
  font-size: 0.37333rem;
  line-height: 33px;
  background-color: #fff;
}
.pay {
  margin: 0 auto;
  width: 347px;
  height: 52px;
  line-height: 33px;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
  overflow: hidden;
}
.btn {
  width: 56px;
  height: 28px;
  background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
  opacity: 1;
  border-radius: 8px;
  border: 1px solid #eb6133;
}
.myWallet {
  .myCd {
    background-image: url('~@/assets/images/orders/myCd.png');
    background-size: cover;
    background-repeat: inherit;
    width: 347px;
    height: 168px;
    margin: 14px 14px 20px;
    // border-radius: 20upx;

    .assets {
      height: 45px;

      .myAssets {
        margin: 20px 0 0 12px;
        float: left;
        font-size: 18px;
        font-weight: 300;
        color: #ffffff;
      }

      .particulars {
        margin: 24px 12px 0 0;
        float: right;
        font-size: 14px;
        font-weight: 300;
        color: #333333;
      }
    }

    .balance {
      text-align: center;
      font-size: 13px;
      font-weight: 300;
      margin: 10px 0 6px;
      color: #ffffff;
    }

    .amount {
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      color: #ffffff;
    }
    .number {
      display: flex;
      justify-content: space-around;

      .available {
        text-align: center;

        .balance {
          margin-bottom: 6px;
          font-size: 18px;
          font-weight: 300;
          color: #ffffff;
        }

        .amount {
          font-size: 13px;
          font-weight: 200;
          color: #ffffff;
        }
      }

      .freeze {
        text-align: center;

        .balance {
          margin-bottom: 6px;
          font-size: 18px;
          font-weight: 300;
          color: #ffffff;
        }

        .amount {
          font-size: 13px;
          font-weight: 200;
          color: #ffffff;
        }
      }
    }
  }
  .operation {
    margin: 14px;
    display: flex;
    justify-content: space-between;

    .canWith {
      font-size: 16px;
      font-weight: 700;
      color: #333333;
    }
  }
}
</style>
