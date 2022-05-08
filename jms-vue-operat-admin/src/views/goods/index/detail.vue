<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-05 16:13:33
 * @Description  : 商品详情 - 添加|删除公用页面
-->
<template>
  <div class="app-container">
    <!-- 商品基础信息 -->
    <GoodsBaseView
      :isEdit="!!$route.query.isEdit"
      :value="goodsBaseVo"
      @steps="v => (active = v)"
      @setValue="v => (goodsBaseVo = v)"
      v-show="active == 'GOODS_BASE'"
    ></GoodsBaseView>
    <!-- 添加详情信息 -->
    <GoodsInfoView
      :isEdit="!!$route.query.isEdit"
      :value="goodsInfoVo"
      :goodsBase="goodsBaseVo"
      @steps="v => (active = v)"
      @setValue="v => (goodsInfoVo = v)"
      v-show="active == 'GOODS_INFO'"
    ></GoodsInfoView>
    <!-- 添加SKU信息 -->
    <GoodsSkuView
      :isEdit="!!$route.query.isEdit"
      :value="goodsSkuVo"
      :goodsBase="goodsBaseVo"
      @steps="v => (active = v)"
      @setValue="v => (goodsSkuVo = v)"
      @reset="handleResetForm"
      v-if="active == 'GOODS_SKU'"
    ></GoodsSkuView>
  </div>
</template>
<script>
import GoodsBaseView from '../components/GoodsBase'
import GoodsInfoView from '../components/GoodsInfo'
import GoodsSkuView from '../components/GoodsSku'
// base 表单
const baseForm = {
  id: undefined,
  storeId: undefined,
  storeName: undefined,
  goodsName: undefined,
  goodsTitle: undefined,
  marketPrice: '',
  salePrice: '',
  integral: 0,
  postage: '',
  integralType: 0,
  goodsIcon: '',
  goodsNo: '',
  goodsMark: undefined,
  primaryCategoryId: undefined,
  primaryCategoryName: undefined,
  secondaryCategoryId: undefined,
  secondaryCategoryName: undefined,
  level3CategoryId: undefined,
  level3CategoryName: undefined
}
// info 表单
const infoForm = {
  id: undefined,
  goodsId: undefined,
  goodsName: undefined,
  detailImg: '',
  goodsLabel: '',
  bannerImg: ''
}
// sku 表单
const skuForm = {
  id: undefined,
  goodsId: undefined,
  goodsName: undefined,
  skuName: undefined,
  amount: '',
  salePrice: '',
  settlePrice: '',
  quota: '',
  integral: 0,
  integralType: 1,
  incomeAmount: 0,
  incomeBsCode: undefined,
  incomeType: undefined,
  checked: false,
  skuImg: undefined
}
import { getGoodsBase, getGoodsInfo, getGoodsSkuList } from '@/api/goods'

export default {
  name: 'GoodsDetail',
  components: { GoodsBaseView, GoodsInfoView, GoodsSkuView },
  data () {
    return {
      // 是否修改
      isEdit: false,
      // 当前显示步骤
      active: 'GOODS_BASE',
      // 商品ID
      goodsId: undefined,
      // 商品基础信息对象
      goodsBaseVo: null,
      // 商品详情信息
      goodsInfoVo: null,
      // 商品SKU信息
      goodsSkuVo: null
    }
  },
  created () {
    this.goodsId = this.$route.query.goodsId
    // if (this.goodsId && !!this.$route.query.isEdit) {
    //   this.isEdit = true
    //   this.getGoodsDetail()
    // } else {
    //   this.handleResetForm()
    // }
    // this.isEdit = true
    console.log(!!this.$route.query.isEdit)
    this.getGoodsDetail()
  },
  methods: {
    /** 重置表单 */
    handleResetForm () {
      this.goodsBaseVo = _.assign({}, baseForm)
      this.goodsInfoVo = _.assign({}, infoForm)
      this.goodsSkuVo = _.concat([], [_.assign({}, skuForm)])
    },
    /** 获取商品信息（基础、详情、sku） */
    getGoodsDetail () {
      getGoodsBase({ goodsId: this.goodsId }).then(res => {
        this.goodsBaseVo = _.assign({}, res.data)
      })
      getGoodsInfo({ goodsId: this.goodsId }).then(res => {
        this.goodsInfoVo = _.assign({}, res.data)
      })
      getGoodsSkuList({ goodsId: this.goodsId }).then(res => {
        if (_.size(res.data) > 0) {
          this.goodsSkuVo = _.concat([], res.data)
        } else {
          this.goodsSkuVo = _.concat([], [_.assign({}, skuForm)])
        }
      })
    }
  }
}
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
