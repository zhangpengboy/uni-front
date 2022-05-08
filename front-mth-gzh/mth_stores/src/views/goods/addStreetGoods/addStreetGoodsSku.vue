<!-- 街市商品-商品sku信息 -->
<template>
  <div class="addStreetGoodsSku">
    <van-form validate-first
              class="bg-white px-3 py-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">门店价格</span>
        </p>
        <van-field class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   v-model="form.marketPrice"
                   placeholder="请输入商品的门店价格">
          <template #extra>
            <span class="color-text">元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">销售价格</span>
        </div>
        <van-field class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   v-model="form.salePrice"
                   placeholder="请输入商品vip价格">
          <template #extra>
            <span class="color-text"> 元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">vip价格</span>
        </div>
        <van-field class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   v-model="form.vipPrice"
                   placeholder="请输入商品vip价格">
          <template #extra>
            <span class="color-text"> 元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">结算价格</span>
        </p>
        <van-field class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   v-model="form.settledPrice"
                   placeholder="请输入商品的结算价格">
          <template #extra>
            <span class="color-text">元</span>
          </template>
        </van-field>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">可用库存</span>
        </p>
        <van-field class="w-75 cell px-2 py-1"
                   :border="false"
                   type="number"
                   maxlength="6"
                   v-model="form.stockQty"
                   placeholder="请输入商品的可用库存">
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center my-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">礼券规则</span>
        </p>
        <van-field class="w-25 cell px-1 py-1"
                   input-align="right"
                   readonly
                   clickable
                   v-model="form.integralName"
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="showIntegralType = true">
        </van-field>
        <van-field class="w-45 cell px-1 py-1"
                   type="number"
                   maxlength="6"
                   v-model="form.integral"
                   :placeholder="`请输入商品${
            form.integralType ? '赠送' : '抵扣'
          }的礼券`">
        </van-field>
      </div>

      <div class="d-flex justify-content-between align-items-center my-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">使用时间</span>
        </div>
        <van-field class="w-75 cell px-2 py-1"
                   readonly
                   clickable
                   v-model="form.useTime"
                   right-icon="arrow"
                   placeholder="请选择"
                   @click="showUseTime=true">
        </van-field>
      </div>
      <p class="d-flex align-items-center pl-2 pb-2">
        <span class="fs-14 color-text">注意事项</span>
      </p>
      <van-field v-model="form.purchaseNotice"
                 type="textarea"
                 maxlength="50"
                 placeholder="请输入注意事项，例如:一次只能消费..."
                 show-word-limit
                 :border="false"
                 :autosize="{ maxHeight: 100, minHeight: 30 }"
                 class="cell" />
    </van-form>
    <van-cell center
              class="bg-white px-3 py-2 mt-2">
      <template #title>
        <span class="fs-14 color-text pr-3">上架状态</span>
        <span class="fs-14 color-text">审核通过后直接上架</span>
      </template>
      <template #right-icon>
        <van-switch v-model="form.automaticFlag"
                    active-color="#FA3B1C"
                    inactive-color="#C1C1C1"
                    active-value="1"
                    inactive-value="0"
                    size="24px" />
      </template>
    </van-cell>
    <van-button class="mt-8 but ball bg-primary"
                round
                block
                type="info"
                @click="onStep">上一步</van-button>
    <van-button color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
                block
                size="small"
                round
                :loading="fullscreenLoading"
                @click="sub"
                class="but my-4 ">提交审核</van-button>

    <!-- 礼券方式 -->
    <van-popup v-model="showIntegralType"
               position="bottom"
               round
               :close-on-popstate="false"
               :safe-area-inset-bottom="true">
      <van-picker title="礼券方式"
                  show-toolbar
                  :columns="integralTypekColumns"
                  @confirm="onConfirmIntegralType"
                  @cancel="showIntegralType = false" />
    </van-popup>
    <!-- 选择时间 -->
    <van-popup v-model="showUseTime"
               position="bottom"
               round
               :close-on-popstate="false"
               :safe-area-inset-bottom="true">
      <van-datetime-picker v-model="currentDate"
                           type="datetime"
                           title="选择完整时间"
                           @confirm="onConfirmTime"
                           @cancel="showUseTime = false"
                           :min-date="minDate"
                           :max-date="maxDate" />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'addStreetGoodsSku',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fullscreenLoading: Boolean
  },
  data () {
    return {
      showIntegralType: false,
      integralTypekColumns: ['抵扣礼券', '赠送礼券'],
      showUseTime: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    }
  },
  created () {
    console.log(this.form)
    this.form.integralName = this.integralTypekColumns[this.form.integralType]
  },
  methods: {
    // 礼券方式弹框
    onConfirmIntegralType (value, index) {
      this.form.integralType = index
      this.form.integralName = value
      this.showIntegralType = false
    },
    onConfirmTime (time) {
      this.form.useTime = this.$lance.parseTime(time, '{y}-{m}-{d} {h}:{i}')
      this.showUseTime = false
    },
    // 提交
    sub () {
      if (!this.form.marketPrice) return this.$toast('门店价格不能为空!')
      if (!this.form.salePrice) return this.$toast('销售价格不能为空!')
      if (!this.form.vipPrice) return this.$toast('vip价格不能为空!')
      if (!this.form.settledPrice) {
        return this.$toast('结算价格不能为空!')
      }
      if (this.form.vipPrice - this.form.settledPrice < 0) {
        return this.$toast('结算价格不能大于vip价!')
      }
      if (!this.form.stockQty) return this.$toast('可用库存不能为空!')
      if (!this.form.integralName && !this.form.integral) return this.$toast('礼券规则不能为空!')
      if (!this.form.useTime) return this.$toast('使用时间不能为空!')
      this.$emit('skuLastStep', this.form)
    },
    // 上一步
    onStep () {
      this.$emit('skuOnStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.addStreetGoodsSku {
  // height: 100vh;
  // background: #fff;
  .label-width {
    min-width: 70px;
  }
  .cell {
    border: 1px solid #f2f2f2;
    border-radius: 8px;
  }
}
</style>
