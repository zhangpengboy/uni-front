<template>
  <div>
    <van-list
      v-if="dataOK || MoneyList.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getMoneyList"
    >
      <div class="moneyList">
        <div class="moneyItem" v-for="(item, index) in MoneyList" :key="index">
          <div class="item">
            <div class="instructions">
              <div class="note">
                {{ item.des }}
              </div>
              <div class="amount" v-if="item.status === 0">
                {{ item.amount === 0 ? '' : '-' }}{{ item.amount }}
              </div>
              <div class="addAmount" v-if="item.status === 1">
                +{{ item.amount }}
              </div>
            </div>
            <div class="time">
              {{ $lance.parseTime(item.createTime) }}
              <text v-if="item.freeStatus === 0">(冻结)</text>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_discount@2x.png')"
      description="无相关明细"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataOK: true,
      MoneyList: [],
      loading: false,
      finished: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        actCode: ''
      }
    }
  },
  created () {
    this.getMoneyList()
  },
  methods: {
    // 获取明细
    getMoneyList () {
      this.loading = true
      this.$http.post(
        this.$apiUri.APP_USERMONEYLIST,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
          this.MoneyList = _.concat(this.MoneyList, res.data.list)
          this.loading = false
          if (
            res.data.totalPage === 0 ||
            res.data.totalPage === this.queryParams.pageNum
          ) {
            this.finished = true
            return
          }
          this.queryParams.pageNum++
        },
        err => {
          this.loading = false
          this.dataOK = true
          this.finished = true
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
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
          font-weight: 500;
          color: #333333;
        }

        .addAmount {
          font-size: 16px;
          font-weight: 500;
          color: #eb6133;
        }

        .amount {
          font-size: 16px;
          font-weight: 500;
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
</style>
