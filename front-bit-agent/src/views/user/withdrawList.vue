<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-06 14:57:05
 * @Description : 提现记录
-->

<template>
  <div class="center">
    <van-tabs v-model:active="active" color="#1989FA">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="处理中" name="0"></van-tab>
      <van-tab title="已完成" name="1"></van-tab>
      <van-tab title="已取消" name="4"></van-tab>
    </van-tabs>

    <!-- 列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多数据了"
      :immediate-check="false"
      class="mt-2"
      @load="getWithdrawList()"
    >
      <div class="main-wrap" v-for="(v, i) in list" :key="i">
        <van-cell class="fs-12">
          <template #default>
            <span :class="v.status === 4 ? 'color-red' : 'color-main'">{{
              $lance.filterWithdrawStatus(v.status)
            }}</span>
          </template>
          <template #title>
            <span class="color-light">{{
              $lance.parseTime(v.createTime)
            }}</span>
          </template>
        </van-cell>
        <van-cell class="fs-12" title="订单号">
          <template #default>
            <span>{{ v.orderNo }}</span>
          </template>
        </van-cell>
        <van-cell class="fs-12" title="卡号">
          <template #default>
            <span>{{ v.bankName }}({{ $lance.filterCardNo(v.cardNo) }})</span>
          </template>
        </van-cell>
        <div class="main-wrap-cont d-flex">
          <div class="w-50">
            <p class="fs-12">{{ $lance.filterBitType(v.bitType) }}提现</p>
            <h2 class="fw-b mt-2">
              <span class="fs-12">&yen;</span>
              <span class="fs-20">{{ v.actCny }}</span>
            </h2>
          </div>
          <div class="w-50">
            <p
              class="
                d-flex
                justify-content-between
                align-items-center
                mb-2
                fs-12
                van-ellipsis
              "
            >
              <span class="color-light">单价</span>
              <span>{{ v.cnyTrans }} CNY</span>
            </p>
            <p
              class="
                d-flex
                justify-content-between
                align-items-center
                fs-12
                van-ellipsis
              "
            >
              <span class="color-light">数量</span>
              <span>{{ v.money }} {{ $lance.filterBitType(v.bitType) }}</span>
            </p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import Decimal from "decimal.js-light";
import $_ from "lodash";
import $http from "@/api/index.js";
import $apiUri from "@/api/config";
import { ref, watch, onMounted } from "vue";
export default {
  setup() {
    const active = ref("");
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    const queryParams = ref({
      status: null, // 0->待审核；1->已完成；4->审核失败
      pageNum: 1,
      pageSize: 5,
    });
    watch(
      () => active.value,
      (newV) => {
        list.value = [];
        finished.value = false;
        queryParams.value = $_.assign(
          {},
          {
            status: newV,
            pageNum: 1,
            pageSize: 5,
          }
        );
        getWithdrawList();
      }
    );
    /** 获取提现列表 */
    const getWithdrawList = () => {
      loading.value = true;
      $http.post($apiUri.APP_AGENTMONEY_DRAWLIST, queryParams.value, (res) => {
        if (finished.value) return;
        $_.map(res.data.list, (v) => {
          v.actCny = Decimal(v.actMoney).mul(v.cnyTrans).toFixed(2);
        });
        list.value = $_.concat(list.value, res.data.list);
        loading.value = false;
        if (
          res.data.totalPage === 0 ||
          res.data.totalPage === queryParams.value.pageNum
        ) {
          finished.value = true;
          return;
        }
        queryParams.value.pageNum++;
      });
    };
    onMounted(() => {
      getWithdrawList();
    });
    return {
      active,
      list,
      loading,
      finished,
      getWithdrawList,
    };
  },
};
</script>
