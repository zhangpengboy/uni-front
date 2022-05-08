<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 14:46:27
 * @Description : 提现记录
-->

<template>
  <div>
    <van-sticky offset-top="1.2432432432432432rem">
      <div class="tagTop">
        <div class="left">提现账号</div>
        <div class="right">提现状态</div>
      </div>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 列表 -->
      <van-list
        v-if="dataOK || list.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="我是有底线的"
        @load="getList"
      >
        <div v-for="(item, index) in list" :key="index">
          <van-cell>
            <div class="list">
              <div>
                <div>
                  <div class="money">
                    {{ item.cardNo }}
                  </div>

                  <div class="time">
                    {{ $lance.parseTime(item.createTime) }}
                  </div>
                </div>
              </div>
              <div>
                <div class="money_one">
                  <span>{{ item.withdrawStatus === 2 ? '+' : '-'  }}</span>
                  <span>{{ item.money }}</span>
                </div>

                <div class="cg" v-if="item.withdrawStatus == 1">提现成功</div>
                <div class="cb" v-if="item.withdrawStatus == 2">提现失败</div>
              </div>
            </div>
          </van-cell>
          <div class="van-hairline--top"></div>
        </div>
      </van-list>
      <van-empty
        v-else
        class="custom-image"
        :image="require('@/assets/images/empty/no_discount@2x.png')"
        description="暂无记录"
      />
    </van-pull-refresh>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      dataOK: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      shop: ''
    }
  },
  // computed: {
  //   ...mapState(['shop'])
  // },
  created () {
    this.shop = this.$lance.getData('storeId')
    this.getList()
  },
  methods: {
    getList () {
      // this.accountId = this.$lance.getData('accountId')

      this.queryParams.userId = this.shop
      this.loading = true
      this.$http.post(this.$apiUri.APP_ADD_TX_LIST, this.queryParams, res => {
        if (this.finished) return
        this.dataOK = false
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
      },
      err => {
        this.loading = false
        this.dataOK = true
        this.finished = true
        this.$toast(err.message)
      })
    },
    onRefresh () {
      this.$toast('刷新成功')
      this.isLoading = false
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.cg {
  font-size: 12px;
  font-weight: 300;
  color: #999999;
  text-align: right;
}
.cb {
  font-size: 12px;
  font-weight: 300;
  color: #ec221e;
  text-align: right;
}
.money_one {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  text-align: right;
}
.time {
  font-size: 12px;
  font-weight: 300;
  color: #999999;
}
.money {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  text-align: right;
}
.list {
  display: flex;
  justify-content: space-between;
}

.tagTop {
  display: flex;
  z-index: 1;
  line-height: 48px;
  justify-content: space-between;
  background: #eb6132;
  color: #fff;
  .left {
    margin-left: 18px;
  }
  .right {
    margin-right: 18px;
  }
}
</style>
