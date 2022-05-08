<template>
  <div class="myWallet">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      :border="false"
      placeholder
      @click-left="$router.back()"
      @click-right="openExplain = true"
    >
      <template #right>
        <van-icon name="info-o" size="18" />
      </template>
    </van-nav-bar>
    <div class="myCd">
      <div class="assets">
        <div class="myAssets">礼券总数 （个）</div>
        <div class="particulars">
          {{ userMoney.allAmount }}
        </div>
        <!-- <div class="particulars" @click="goTheDeatil">明细</div> -->
      </div>
      <div class="number">
        <div
          class="available"
          v-for="(item, index) in activeList"
          :key="index"
          @click="clickSwitch(item, index)"
        >
          <div class="balance" v-if="item.index == 0">
            {{ userMoney.freeAmount }}
          </div>
          <div class="balance" v-if="item.index == 1">
            {{ userMoney.frozenAmount }}
          </div>
          <div class="balance" v-if="item.index == 2">
            {{ userMoney.lockAmount }}
          </div>
          <div class="amount">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 礼券说明弹框 -->
    <van-dialog v-model="openExplain" theme="round-button">
      <p class="dialog-title">礼券说明</p>
      <p class="dialog-text">
        1、会员可使用礼券在平台消费，抵扣或兑换对 应的商品或服务
      </p>
      <p class="dialog-text">
        2、会员应按照平台规定正当获取使用礼券，对
        任何涉嫌非正当途径获取或使用礼券，平台有
        权收回会员账户及关联账户中的礼券，并取消 相应的礼券权益
      </p>
      <p class="dialog-text">
        3、平台可根据实际情况，对礼券进行变更或调 整，相关变动将在规则说明展示
      </p>
      <br />
    </van-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userMoney: {},
      listIndex: 0,
      aliaccount: true,
      openExplain: false,
      activeList: [
        {
          name: '可用礼券',
          index: 0
        },
        {
          name: '冻结礼券',
          index: 1
        },
        {
          name: '待释放礼券',
          index: 2
        }
      ],
      dataOK: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.getMoney()
  },
  methods: {
    // 切换tabs
    clickSwitch (item, index) {
      this.$router.push({
        path: 'gather',
        query: {
          index: index
        }
      })
      // this.$router.push('gather')
      // console.log(index)
      if (this.listIndex === index) return
      this.listIndex = index
    },
    // toGather () {
    //   //
    //   console.log(111)
    // },

    getMoney () {
      this.$http.post(
        this.$apiUri.APP_USERINTEGRAL_GET,
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
.activeTop {
  color: #eb6132 !important;
  font-size: 18px !important;
  // border-bottom: 2px solid #eb6132 !important;
}
.myWallet {
  .myCd {
    background-image: url('~@/assets/images/orders/mygift.png');
    background-size: cover;
    background-repeat: inherit;
    width: 347px;
    height: 168px;
    margin: 14px 14px 20px;

    .assets {
      height: 45px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      font-weight: 300;
      color: #ffffff;
      .myAssets {
        margin-left: 12px;
        font-size: 18px;
      }

      .particulars {
        margin-left: 12px;
        font-size: 20px;
      }
    }

    .number {
      display: flex;
      justify-content: space-around;

      .available {
        text-align: center;
        margin-top: 56px;

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
        margin-top: 56px;

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
    margin: 18px 0 12px 14px;
    .canWith {
      font-size: 16px;
      font-weight: 700;
      color: #333333;
    }
  }

  .moneyList {
    margin: 0 14px;
    background-color: #fff;
    border-radius: 8px;
    .moneyItem {
      .item {
        height: 72px;
        box-sizing: border-box;
        padding-top: 14px;
        border-bottom: 1px solid #f6f6f6;
        .instructions {
          display: flex;
          justify-content: space-between;
          margin: 0 14px;
          .note {
            font-size: 15px;
            font-weight: 700;
            color: #333333;
          }

          .addAmount {
            font-size: 16px;
            font-weight: 700;
            color: #eb6133;
          }

          .amount {
            font-size: 16px;
            font-weight: 700;
            color: #333333;
          }
        }

        .time {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          margin-left: 14px;
          margin-right: 14px;
          font-size: 12px;
          font-weight: 300;
          color: #999999;
        }
      }
    }
  }
  .dialog-title {
    font-size: 16px;
    color: #666;
    text-align: center;
    margin: 20px 0;
  }
  .dialog-title::before {
    content: '—';
    margin-right: 12px;
  }
  .dialog-title::after {
    content: '—';
    margin-left: 12px;
  }
  .dialog-text {
    font-size: 13px;
    color: #666;
    text-align: left;
    line-height: 22px;
    margin: 0 16px;
  }
}
</style>
