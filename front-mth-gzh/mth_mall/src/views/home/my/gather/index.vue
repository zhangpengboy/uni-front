<template>
  <div>
    <div class="taber">
      <div
        v-for="(item, index) in activeList"
        :key="index"
        @click="clickSwitch(index)"
      >
        <div :class="{ activeTop: listIndex == index }">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="van-hairline--bottom"></div>
      <van-list
        v-if="dataOK || freeze.length > 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="getGiftList(listIndex)"
      >
        <div class="moneyList">
          <div class="moneyItem" v-for="(item, index) in freeze" :key="index">
            <div class="item">
              <div class="instructions">
                <div class="note">
                  {{ item.des }}
                </div>
                <div class="amount" v-if="item.status === 1">
                  +{{ item.amount }}
                </div>
                <div class="amounts" v-if="item.status === 0">
                  -{{ item.amount }}
                </div>
                <!-- <div class="addAmount" v-if="item.status === 1">
                +{{ item.amount }}
              </div> -->
              </div>
              <div class="time">
                {{ $lance.parseTime(item.createTime) }}
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
      active: 0,
      dataOK: true,
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
      listIndex: 0,
      loading: false,
      finished: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      freeze: [] // 冻结
    }
  },
  created () {
    this.listIndex = this.$route.query.index * 1
    this.getGiftList(this.listIndex)
  },
  methods: {
    // 切换tabs
    clickSwitch (index) {
      this.freeze = []
      this.listIndex = index
      this.dataOK = true
      this.finished = false
      this.loading = true
      this.queryParams = _.assign(
        {},
        {
          pageNum: 1,
          pageSize: 10
        }
      )
      this.getGiftList(index)
    },
    getGiftList (index) {
      if (index === 0) {
        this.getList(this.$apiUri.APP_USERINTEGRALLIST_GET)
      } else if (index === 1) {
        this.getList(this.$apiUri.APP_STORE_ROLE_LISTBYID)
      } else {
        this.getList(this.$apiUri.APP_ADD_UPDTA_LOCKLIST)
      }
    },
    getList (url) {
      this.$http.post(
        url,
        this.queryParams,
        res => {
          if (this.finished) return
          this.dataOK = false
          this.freeze = _.concat(this.freeze, res.data.list)
          this.loading = false
          console.log(this.freeze)
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
  margin: 12px 14px;
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
          padding-top: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #ed6311;
        }
        .amounts {
          padding-top: 10px;
          font-size: 16px;
          font-weight: 700;
          color: #000;
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
.taber {
  height: 46px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.activeTop {
  color: #eb6132 !important;
  font-size: 18px !important;
  // border-bottom: 2px solid #eb6132 !important;
}
</style>
