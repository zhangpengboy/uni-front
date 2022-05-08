<template>
  <div class="commission">
    <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="commission-raw"
          v-for="(item, i) in state.commissinList"
          :key="i"
        >
          <p class="commission-no">
            <span class="commission-key">订单号：</span
            ><span class="commission-value">{{ item.orderNo }}</span>
          </p>
          <p class="commission-no">
            <span class="commission-key">用户：</span
            ><span class="commission-value">{{ item.userId }}</span>
          </p>
          <p class="commission-no">
            <span class="commission-key">佣金来源：</span
            ><span class="commission-value">{{ item.des }}</span>
          </p>
          <!-- <p class="commission-no">
            <span class="commission-key">奖励级别：</span
            ><span class="commission-value">{{ item.rank }}</span>
          </p> -->
          <p class="commission-no">
            <span class="commission-key">币种：</span
            ><span class="commission-value mr-4">{{
              $lance.filterBitType(item.bitType)
            }}</span>
            <span class="commission-key">数量：</span
            ><span class="commission-value">{{ item.money }}</span>
          </p>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import $apiUri from "@/api/config";
import $http from "@/api/index.js";
// import { Toast } from "vant";
import { reactive } from "vue";
export default {
  setup() {
    const state = reactive({
      commissinList: [],
      loading: false,
      finished: false,
      refreshing: false,
    });
    const queryParams = reactive({
      machineType: "1", // 1>比特币矿机;2>以太币矿机;3>比特币算力;4>以太币算力;5>FIL算力;6>XCH算力'
      pageNum: 1,
      pageSize: 10,
    });
    const onLoad = () => {
      if (state.refreshing) {
        state.commissinList = [];
        state.refreshing = false;
      }
      $http.post($apiUri.APP_AGENTMONEY_LIST, queryParams, (res) => {
        if (state.finished) return;
        state.commissinList = _.concat(state.commissinList, res.data.list);
        state.loading = false;
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === queryParams.pageNum
        ) {
          state.finished = true;
          return;
        }
        queryParams.pageNum++;
      });
    };
    // 刷新
    const onRefresh = () => {
      state.finished = false;
      state.loading = true;
      onLoad();
    };
    return {
      state,
      onLoad,
      onRefresh,
    };
  },
};
</script>

<style lang="scss" scoped>
.commission {
  &-raw {
    background-color: #fff;
    padding: 12px 16px;
    margin-bottom: 4px;
  }
  &-no {
    padding: 6px 0;
  }
  &-key {
    font-size: 0.8rem;
    color: #999;
  }
  &-value {
    font-size: 0.8rem;
    color: #333;
  }
}
</style>
