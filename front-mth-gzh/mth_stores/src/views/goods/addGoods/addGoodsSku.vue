<!-- 添加商品SKU -->
<template>
  <div class="addGoods">
    <goods-sku-item
      v-for="(item, index) in list"
      :skuItem="item"
      :key="index"
      @addSku="addSku"
      @delSku="delSku"
      @skuChange="skuChange"
      :skuKey="index"
      :ref="'goodsSkuForm_' + index"
    />
    <!-- <van-form validate-first class="bg-white p-3 p mt-2">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="fs-14 color-text mr-3">上架状态</span>
          <span class="fs-13 color-text">审核通过后直接上架</span>
        </div>
        <van-switch v-model="checked" active-color="#eb6133" inactive-color="#dcdee0" size="24px"/>
      </div>
    </van-form> -->
    <van-button
        color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
        block
        size="small"
        round
        :loading="fullscreenLoading"
        @click="submitNextForm"
        class="mb-8 mt-4 but"
        >提交审核</van-button
      >
  </div>
</template>

<script>
import GoodsSkuItem from './goodsSkuItem.vue'
export default {
  name: 'addGoodsSku',
  components: { GoodsSkuItem },
  data () {
    return {
      // 删除skuList
      delList: [],
      list: [],
      goodsBase: {},
      checked: null,
      fullscreenLoading: false
    }
  },
  created () {
    this.goodsBase = this.$lance.getJson('goodsBase')
    this.getGoodsSkuList()
  },
  methods: {
    // huo APP_STORE_GOODS_SKULIST
    getGoodsSkuList () {
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_SKULIST,
        { goodsId: this.goodsBase.id },
        res => {
          if (res.data.length > 0) {
            this.list = res.data
          } else {
            this.list = [
              {
                id: undefined,
                goodsId: this.goodsBase.id,
                goodsName: this.goodsBase.goodsName,
                skuName: undefined,
                checked: false,
                amount: null,
                salePrice: undefined,
                marketPrice: undefined,
                quota: undefined,
                integral: 0,
                integralType: 1,
                skuImg: null,
                integralName: '赠送礼券'
              }
            ]
          }
        }, err => {
          this.$toast(err.message)
        }
      )
    },
    // 添加套餐
    addSku () {
      const _data = _.assign(
        {},
        {
          id: undefined,
          goodsId: this.goodsBase.id,
          goodsName: this.goodsBase.goodsName,
          skuName: undefined,
          checked: false,
          amount: null,
          salePrice: undefined,
          marketPrice: undefined,
          quota: undefined,
          integral: 0,
          integralType: 1,
          skuImg: null,
          integralName: '赠送礼券'
        }
      )
      this.list.push(_data)
    },
    skuChange (i, state) {
      // console.log('子传值', i, state)
      this.skuIndex = i
      const _list = _.cloneDeep(this.list)
      // 下标,状态
      _list.map((item, index) => {
        if (state) {
          if (i === index) {
            item.checked = true
            item.disabled = false
          } else {
            item.checked = false
            item.disabled = true
          }
        } else {
          item.checked = false
          item.disabled = false
        }
      })
      this.list = _list
      // console.log(this.list)
    },
    /** 删除套餐 */
    delSku (index) {
      const _list = _.cloneDeep(this.list)
      _.remove(_list, (v, i) => {
        if (index === i && v.id) {
          this.delList.push(v)
        }
        this.skuIndex = i
        return index === i
      })
      this.list = _list
    },
    // 提交审核
    submitNextForm () {
      let _data = {
        // 新增skuList
        addList: [],
        // 修改skuList
        updateList: [],
        // 删除skuList
        delList: _.cloneDeep(this.delList)
      }
      _.each(this.list, (v) => {
        v.goodsId = this.goodsBase.id
        v.goodsName = this.goodsBase.goodsName
        if (v.id === undefined) {
          // 新增
          _data.addList.push(v)
        } else {
          // 修改
          _data.updateList.push(v)
        }
      })
      const v = this.list[this.list.length - 1]
      if (!v.skuName) return this.$toast('套餐名称不能为空')
      if (!v.amount) return this.$toast('库存数量不能为空')
      const numzz = /(^[1-9]\d*$)/
      if (!numzz.test(v.amount)) return this.$toast('请输入正确库存数量')
      if (!v.marketPrice) return this.$toast('原价不能为空')
      const zz = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (!zz.test(v.marketPrice)) {
        return this.$toast('请输入正确的价格')
      }
      if (!v.salePrice) return this.$toast('销售价不能为空')
      if (!zz.test(v.salePrice)) {
        return this.$toast('请输入正确的价格')
      }
      if (!v.quota) return this.$toast('限购数量不能为空')
      if (!numzz.test(v.quota)) return this.$toast('请输入正确限购数量')
      if (!v.integral) return this.$toast('礼券数量不能为空')
      if (!/(^[0-9]\d*$)/.test(v.integral)) return this.$toast('请输入正确礼券数量')
      if (!v.skuImg) return this.$toast('套餐缩略图不能为空')
      let num = 0
      let addListNum = 0
      let allList = [..._data.addList, ..._data.updateList]
      addListNum = allList.length
      // console.log('allList:', allList)
      allList.map(item => {
        if (!item.checked) {
          num += 1
        }
      })
      if (addListNum === num) {
        this.$toast('请选择sku套餐')
        return
      }
      this.fullscreenLoading = true
      this.$http.post(
        this.$apiUri.APP_STORE_GOODS_SKU,
        _data,
        res => {
          this.fullscreenLoading = false
          this.$toast('提交成功，耐心等待审核')
          this.$router.push({
            name: 'goods',
            query: {
              active: 0
            }
          })
        }, err => {
          this.fullscreenLoading = false
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.addGoods {
  .label-width {
    min-width: 70px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
  .addSku-btu {
    width: 100px;
    height: 38px;
    font-size: 14px;
    background: linear-gradient(180deg, #F1722C 0%, #EB6133 100%);
    border-radius: 41px;
    line-height: 38px;
    color: #fff;
    text-align: center;
  }
}
</style>
