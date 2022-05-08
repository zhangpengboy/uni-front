<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-27 11:49:07
 * @Description : 共享算力显示布局
-->
<template>
  <div class="container-wrap goods-layout">
    <div class="goods-left-box">
      <h2 class="goods-title">
        共享算力90天
        <span class="tips hot">hot</span>
        <span class="tips">押金可退</span>
        <span class="tips">免除电费</span>
      </h2>
      <el-row class="goods-row">
        <el-col :span="10" class="goods-col">
          <p class="goods-label">预期年化收益率</p>
          <div class="goods-value color-main">18.00%~64.00%</div>
        </el-col>
        <el-col :span="14" class="goods-col">
          <p class="goods-label">预计日产出</p>
          <div class="goods-value color-main">
            <span> 0.000009 </span>
            <span class="goods-value-small"> BTC/份≈0.62 CNY </span>
          </div>
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
          本批剩余：
          <span class="color-main">275</span>
          <span> 份 </span>
        </div>
      </div>
    </div>
    <div class="jms-right-box">
      <div class="from">
        <div class="from-label">购买份数</div>
        <el-input-number
          v-model="objs.num"
          :min="1"
          :max="10"
        ></el-input-number>
        <div class="from-label">认证金额</div>
        <el-select
          v-model="value"
          size="large"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
  /** 数量 */
  num: number;
}

export default Vue.extend({
  name: 'shareBlock',
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
      options: [
        {
          value: '选项1',
          label: '30天',
        },
        {
          value: '选项2',
          label: '90天',
        },
        {
          value: '选项3',
          label: '180天',
        },
        {
          value: '选项4',
          label: '360天',
        },
        {
          value: '选项5',
          label: '720天',
        },
      ],
      value: '',
      checked: false,
    };
  },
  computed: {
    objs() {
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
    padding: 0;
  }
}
</style>
