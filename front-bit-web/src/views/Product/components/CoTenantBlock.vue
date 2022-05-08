<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-27 11:49:07
 * @Description : 合租挖矿显示布局
-->
<template>
  <div class="container-wrap goods-layout">
    <div class="goods-left-box">
      <h2 class="goods-title">
        矿场180天精选合租挖矿 <span class="tips">押金保障</span>
      </h2>
      <el-row class="goods-row">
        <el-col :span="6" class="goods-col">
          <p class="goods-label">预计年化收益</p>
          <div class="goods-value color-main">13.00%</div>
        </el-col>
        <el-col :span="9" class="goods-col">
          <p class="goods-label">起购金额(CNY)</p>
          <div class="goods-value color-main">
            {{ numeral(10000).format('0,0.00') }}
          </div>
        </el-col>
        <el-col :span="9" class="goods-col">
          <p class="goods-label">服务期限</p>
          <div class="goods-value color-main">360天</div>
        </el-col>
      </el-row>

      <div class="goods-footer">
        <div class="progress">
          <el-progress
            :show-text="false"
            :stroke-width="6"
            :percentage="40"
            status="warning"
          ></el-progress>
        </div>
        <div class="text">
          剩余金额：<span class="color-main">{{numeral(480000).format('0,0.00')}} CNY</span>
        </div>
      </div>
    </div>
    <div class="jms-right-box">
      <div class="from">
        <div class="from-label">认证金额</div>
        <el-input
          v-model="amount"
          placeholder="起购金额为1000且是100的倍数"
          size="large"
        ></el-input>
        <el-button
          :disabled="!checked || amount == ''"
          type="primary"
          class="btn-buy"
          size="large"
        >
          立即购买
        </el-button>
        <p>
          <el-checkbox v-model="checked">
            我已阅读并同意
            <el-link type="primary">《主要链接》</el-link>
          </el-checkbox>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';

interface ProductData {
  /** 产品ID */
  productId: string;
  /** 产品名称 */
  title: string;
  /** 产品Tag，可以有多个 */
  tags: string | string[];
  /** 子标题 */
  subTitles: (string | ((conf: ProductData) => string))[];
  /** 子项值 */
  subVals: (string | any)[];
  /** 已售百分比 */
  percent: number;
}

export default Vue.extend({
  name: 'CoTenantBlock',
  props: {
    items: {
      type: Object,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      amount: '',
      checked: false,
    };
  },
  computed: {
    list() {
      return this.items as ProductData;
    },
  },
  methods: {
    moment,
    numeral,
  },
});
</script>
<style lang="less" scoped>
@import '../Product';
.jms-right-box {
  .from {
    padding-left: 0;
  }
}
</style>
