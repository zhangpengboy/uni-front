<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:13:33
 * @Description  : 商品详情 - 添加|删除公用页面
-->
<template>
  <div class="app-container">
    <!-- 商品基础信息 -->
    <GoodsBaseView
      :isEdit="isEdit"
      :value="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsBaseVo = v)"
      v-show="active == 'GOODS_BASE'"
    ></GoodsBaseView>
    <!-- 添加详情信息 -->
    <GoodsInfoView
      :isEdit="isEdit"
      :value="goodsInfoVo"
      :goodsBase="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsInfoVo = v)"
      v-show="active == 'GOODS_INFO'"
    ></GoodsInfoView>
    <!-- 添加SKU信息 -->
    <GoodsSkuView
      :isEdit="isEdit"
      :value="goodsSkuVo"
      :goodsBase="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsSkuVo = v)"
      @reset="handleResetForm"
      v-show="active == 'GOODS_SKU'"
    ></GoodsSkuView>
  </div>
</template>
<script>
import GoodsBaseView from "../components/GoodsBase";
import GoodsInfoView from "../components/GoodsInfo";
import GoodsSkuView from "../components/GoodsSku";
// base 表单
const baseForm = {
  id: undefined,
  productNo: undefined,
  productName: undefined,
  digType: undefined,
  machineType: undefined,
  bitType: undefined,
  allNum: undefined,
  num: undefined,
  hash: undefined,
  hashUnit: undefined,
  power: undefined,
  powerUnit: undefined,
  powerPrice: 1,
  price: undefined,
  prepareTime: 45,
  serviceTime: -1,
  serivceReate: 0.06,
  expectRate: 0.77,
  img: undefined,
};
// info 表单
const infoForm = {
  id: undefined,
  productNo: undefined,
  detail: undefined,
  warning: undefined,
};
// sku 表单
const skuForm = {
  id: undefined,
  productNo: undefined,
  packNo: undefined,
  name: undefined,
  day: 0,
  minNum: 1,
  maxNum: 1,
  rebate: 1,
};
import { getGoodsBase, getGoodsDetail, getGoodsSkuList } from "@/api/goods";

export default {
  name: "GoodsDetail",
  components: { GoodsBaseView, GoodsInfoView, GoodsSkuView },
  data() {
    return {
      // 是否修改
      isEdit: false,
      // 当前显示步骤
      active: "GOODS_BASE",
      // 商品编号
      productNo: undefined,
      // 商品基础信息对象
      goodsBaseVo: {},
      // 商品详情信息
      goodsInfoVo: {},
      // 商品SKU信息
      goodsSkuVo: [],
    };
  },
  created() {
    this.productNo = this.$route.query.productNo;
    if (this.productNo) {
      this.isEdit = true;
      this.getGoodsDetail();
    } else {
      this.handleResetForm();
    }
  },
  methods: {
    /** 重置表单 */
    handleResetForm() {
      this.goodsBaseVo = _.assign({}, baseForm);
      this.goodsInfoVo = _.assign({}, infoForm);
      this.goodsSkuVo = _.concat([], [_.assign({}, skuForm)]);
    },
    /** 获取商品信息（基础、详情、sku） */
    getGoodsDetail() {
      getGoodsBase({ productNo: this.productNo }).then((res) => {
        this.goodsBaseVo = _.assign({}, res.data);
      });

      getGoodsDetail({ productNo: this.productNo }).then((res) => {
        this.goodsInfoVo = _.assign({}, res.data);
      });

      getGoodsSkuList({ productNo: this.productNo }).then((res) => {
        if (_.size(res.data) > 0) {
          this.goodsSkuVo = _.concat([], res.data);
        } else {
          this.goodsSkuVo = _.concat([], [_.assign({}, skuForm)]);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.goods {
  &-form {
    margin-left: 25px;
    margin-right: 25px;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  &-btn {
    width: 150px;
  }
}
</style>