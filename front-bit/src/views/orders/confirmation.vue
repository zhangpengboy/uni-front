<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-22 10:59:30
 * @Description : 确认订单
-->
<template>
  <div class="order p-footer">
    <!-- 地址 -->
    <div class="main-wrap mt-2">
      <template v-if="recinfo">
        <van-cell
          center
          is-link
          icon="location-o"
          :label="recinfo.address"
          @click="handleSelectList"
        >
          <template #title>
            <p>
              <span>{{ recinfo.userName }}</span>
              <span class="ml-2 fs-13">{{ recinfo.phone }}</span>
            </p>
          </template>
        </van-cell>
      </template>
      <template v-else>
        <van-contact-card
          type="add"
          add-text="添加收货地址"
          @click="handleSelectAddr"
        />
      </template>
    </div>

    <!-- 商品信息 -->
    <div class="main-wrap">
      <template v-for="(v, i) in goodsList">
        <van-card
          :key="i"
          :num="v.num"
          :price="v.price"
          :desc="v.skuName"
          :title="v.goodsName"
          :thumb="v.skuImg"
          class="bg-white"
        />
        <van-cell-group :key="i">
          <van-cell title="购买数量">
            <van-stepper v-model.number="v.num" integer />
          </van-cell>
          <!-- <van-field type="text" label="留言">
            <template #input>
            </template>
          </van-field> -->
        </van-cell-group>
      </template>
    </div>

    <div class="main-wrap">
      <van-cell-group>
        <van-cell title="商品总额" :value="'￥' + sumMoney" />
        <van-cell title="运费" value="免费" value-class="color-red" />
      </van-cell-group>
    </div>

    <!-- 底部提交订单 -->
    <van-submit-bar
      :price="payAmount"
      button-text="提交订单"
      @submit="onSubmit"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      addressList: [],
      recinfo: null,
      goodsList: []
    }
  },
  computed: {
    sumMoney: function () {
      let amount = 0
      amount = _.sum(this.goodsList.map((v) => v.price * v.num))
      return amount
    },
    payAmount: function () {
      let amount = 0
      amount = _.sum(this.goodsList.map((v) => v.price * v.num * 100))
      return amount
    }
  },
  mounted () {
    const buyList = this.$lance.getJson('buy-list')
    if (buyList === undefined || _.size(buyList) <= 0) return false
    const GOODS = buyList.filter((v) => v.source === 'goods')
    const CARTS = buyList.filter((v) => v.source === 'carts')
    // 单商品
    if (_.size(GOODS) > 0) {
      this.goodsList.push({
        goodsName: GOODS.goods.goodsName,
        goodsTitle: GOODS.goods.goodsTitle,
        marketPrice: GOODS.goods.marketPrice,
        storeId: GOODS.goods.storeId,
        storeName: GOODS.goods.storeName,
        num: GOODS.skuData.selectedNum,
        goodsId: GOODS.skuData.goodsId,
        price: (GOODS.skuData.selectedSkuComb.price / 100).toFixed(2),
        settlePrice: GOODS.skuData.selectedSkuComb.settlePrice,
        integralType: GOODS.skuData.selectedSkuComb.integralType,
        integral: GOODS.skuData.selectedSkuComb.integral,
        skuId: GOODS.skuData.selectedSkuComb.id,
        skuImg: GOODS.skuData.selectedSkuComb.skuImg,
        skuName: GOODS.skuData.selectedSkuComb.skuName
      })
    }
    // 购物车
    if (_.size(CARTS) > 0) {
      this.goodsList = _.cloneDeep(
        _.map(CARTS, (v) => _.assign(v, { price: v.salePrice.toFixed(2), skuImg: v.skuIcon }))
      )
    }
  },
  methods: {
    /** 获取收货地址 */
    getStoreAddressList () {
      this.$http.post(this.$apiUri.APP_STORE_ADDRESS_LIST, null, (res) => {
        if (_.size(res.data) > 0) {
          this.showAddress = true
          _.map(res.data, (address) => {
            if (address.status) {
              this.recinfo = address
            }
          })
        }
      })
    },
    /** 选择收货地址 */
    handleSelectAddr () {
      this.$router.push({ name: 'addressEdit', query: { isSelect: true } })
    },
    /** 选择收货地址 */
    handleSelectList () {
      this.$router.push({
        name: 'addressList',
        query: {
          isSelect: true,
          chosenAddressId: this.recinfo.id
        }
      })
    },
    /* 选择地址 */
    getSelectAddress () {
      this.recinfo = this.$lance.getJson('select-address')
      if (this.recinfo) {
        return this.$lance.clearStorage('select-address')
      }
      this.getStoreAddressList()
    },
    /** 提交订单 */
    onSubmit () {
      // 提交订单数组
      const orderList = []
      if (_.isEmpty(this.recinfo)) {
        return this.$toast('请填写收货地址')
      }
      _.map(this.goodsList, (v) => {
        const omsOrder = {
          storeId: v.storeId,
          storeName: v.storeName,
          bsType: 'storeOrder'
        }
        const omsOrderDetail = {
          goodsId: v.goodsId,
          goodsName: v.goodsName,
          goodsTitle: v.goodsTitle,
          marketPrice: v.marketPrice,
          goodsSkuId: v.skuId,
          goodsSkuIcon: v.skuIcon,
          goodsSkuName: v.skuName,
          salePrice: v.price,
          settlePrice: v.settlePrice,
          integralType: v.integralType,
          integral: v.integral,
          goodsNum: v.num
        }
        const omsOrderAddress = {
          phone: this.recinfo.phone,
          userName: this.recinfo.userName,
          address: this.recinfo.address
        }
        orderList.push({
          omsOrder,
          omsOrderDetail,
          omsOrderAddress
        })
      })
      this.$http.post(
        this.$apiUri.APP_STORE_ORDER_ADD,
        orderList,
        (res) => {
          // 得到下单失败商品
          let failList = []
          _.map(this.goodsList, (v, i) => {
            if (
              _.find(
                res.data,
                (r) => v.skuId === r.omsOrderDetail.goodsSkuId
              ) === undefined
            ) {
              failList.push(v)
              this.$set(this.goodsList[i], 'fail', true)
            }
          })
          // 提示下单失败的商品信息
          if (_.size(failList) > 0) {
            this.$dialog
              .confirm({
                title: '提示',
                message:
                  '部分商品下单失败，商品可能失败原因：1、库存不足；2、商品已下架。是否支付成功下单的商品？'
              })
              .then(() => {
                return this.toPayment(res.data)
              })
              .catch(() => {
                this.$toast('取消支付')
              })
          }
          this.toPayment(res.data)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    /** 跳转支付 */
    toPayment (result) {
      this.$lance.setJson('pay-order', result)
      this.$router.push('payment')
    }
  },
  activated () {
    this.getSelectAddress()
  }
}
</script>
