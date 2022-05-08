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
      :look="look"
      :value="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsBaseVo = v)"
      v-show="active == 'GOODS_BASE'"
    ></GoodsBaseView>
    <!-- 添加详情信息 -->
    <GoodsInfoView
      :isEdit="isEdit"
      :look="look"
      :value="goodsInfoVo"
      :goodsBase="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsInfoVo = v)"
      v-show="active == 'GOODS_INFO'"
    ></GoodsInfoView>
    <!-- 添加SKU信息 -->
    <GoodsSkuView
      :isEdit="isEdit"
      :look="look"
      :value="goodsSkuVo"
      :goodsBase="goodsBaseVo"
      @steps="(v) => (active = v)"
      @setValue="(v) => (goodsSkuVo = v)"
      @reset="handleResetForm"
      v-if="active == 'GOODS_SKU'"
    ></GoodsSkuView>
  </div>
</template>
<script>
import GoodsBaseView from "./GoodsBase";
import GoodsInfoView from "./GoodsInfo";
import GoodsSkuView from "./GoodsSku";
// base 表单
const baseForm = {
  goodsBanner: '',
  goodsDesc:undefined,
  goodsIcon: "",
  goodsName: undefined,
  goodsNo: '',
  id: undefined,
  integral: 0,
  integralType: 0,
  level1CategoryId: undefined,
  level1CategoryName:undefined,
  // marketPrice: '',
  // salePrice: '',
  // stockQty: undefined
};
// info 表单
const infoForm = {
  id: undefined,
  goodsId: undefined,
  goodsName: undefined,
  detailImg: "",
  goodsLabel: "",
  bannerImg: "",
};
// sku 表单
const skuForm = {
  id: undefined,
  goodsId: undefined,
  goodsName: undefined,
  skuName: undefined,
  salePrice: '',
  settlePrice: '',
  stock: '',
  integral: 0,
  integralType: 1,
  skuImg: undefined,
};
import { storeGoodsBaseGetGoodsBase, storeGoodsBaseGetGoodsBaseSku } from "@/api/goods";

export default {
  name: "StoreDetail",
  components: { GoodsBaseView, GoodsInfoView, GoodsSkuView },
  data() {
    return {
      // 是否修改
      isEdit: false,
      // 当前显示步骤
      active: "GOODS_BASE",
      // 商品ID
      goodsId: undefined,
      // 商品基础信息对象
      goodsBaseVo: null,
      // 商品详情信息
      goodsInfoVo: null,
      // 商品SKU信息
      goodsSkuVo: null,
      look: false,
    };
  },
  created() {
    this.goodsId = this.$route.query.goodsId;
    if (this.goodsId) {
      this.isEdit = true;
      this.getGoodsDetail();
    } else {
      this.handleResetForm();
    }
    if (this.$route.query.look == 'false') {
      this.look = false;
    } else {
      this.look = true;
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
      storeGoodsBaseGetGoodsBase({ goodsId: this.goodsId }).then((res) => {
        console.log(res);
        this.goodsBaseVo = _.assign({}, res.data);
      });
      storeGoodsBaseGetGoodsBaseSku({ goodsId: this.goodsId }).then((res) => {
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
    margin-left: 70px;
    padding-right: 70px;
    margin-top: 25px;
    margin-bottom: 25px;
  }

  &-btn {
    width: 150px;
  }
}
</style>