<!-- 商品SKU套餐组件 -->
<template>
  <div class="goodsSkuItem">
    <van-form
      validate-first
      class="bg-white px-3 py-2"
      :ref="'goodsSkuForm_' + skuKey"
      :model="skuItem"
    >
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">套餐名称</span>
        </p>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          maxlength="15"
          v-model="skuItem.skuName"
          placeholder="请输入套餐名称"
        >
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">库存数量</span>
        </p>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          type="number"
          maxlength="6"
          v-model="skuItem.amount"
          placeholder="请输入库存数量"
        >
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">原价</span>
        </p>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          type="number"
          v-model="skuItem.marketPrice"
          placeholder="请输入商品的原价"
        >
          <template #extra>
            <span class="color-text">元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">销售价</span>
        </p>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          type="number"
          v-model="skuItem.salePrice"
          placeholder="请输入商品的销售价"
        >
          <template #extra>
            <span class="color-text">元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="label-width text-right">
          <span class="fs-10 color-red pr-1">*</span>
          <span class="fs-14 color-text">vip价</span>
        </div>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          type="number"
          v-model="skuItem.vipPrice"
          placeholder="请输入商品vip价格"
        >
          <template #extra>
            <span class="color-text"> 元</span>
          </template>
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">限购数量</span>
        </p>
        <van-field
          class="w-75 cell px-2 py-1"
          :border="false"
          type="number"
          maxlength="6"
          v-model="skuItem.quota"
          placeholder="请输入商品的限购数量"
        >
        </van-field>
      </div>
      <div class="d-flex justify-content-between align-items-center my-2">
        <p class="label-width d-flex align-items-center justify-content-end">
          <span class="color-red pr-1 pt-2">*</span>
          <span class="fs-14 color-text">礼券规则</span>
        </p>
        <van-field
          class="w-30 cell px-1 py-1"
          input-align="right"
          readonly
          clickable
          v-model="skuItem.integralName"
          right-icon="arrow"
          placeholder="请选择"
          @click="showIntegralType = true"
        >
        </van-field>
        <van-field
          class="w-45 cell px-1 py-1"
          type="number"
          maxlength="6"
          v-model="skuItem.integral"
          :placeholder="`请输入商品${
            skuItem.integralType ? '赠送' : '抵扣'
          }的礼券`"
        >
        </van-field>
      </div>
      <van-cell title="套餐缩略图" :border="false" class="px-0">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <div class="d-flex" v-if="isAndroid">
            <div v-if="skuItem.skuImg" class="appImg mr-1">
              <img
                :src="skuItem.skuImg"
                class="camera-bgImg"
                alt=""
                @click="ImagePreview1"
              />
              <div class="icon" @click="deleteUploader1">
                <van-icon name="cross" color="#fff" size="10px" />
              </div>
            </div>
            <img
              v-else
              class="camera-bgImg"
              :src="require('@/assets/images/camera@2x.png')"
              alt=""
              @click="androidUpload('skuImg')"
            />
          </div>
          <van-uploader
            v-else
            v-model="uploader1"
            :max-count="1"
            :max-size="1024 * 1024 * 3"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :before-read="beforeReadFile"
          />
          <p class="fs-13 color-c1">
            （可上传1张图片，建议尺寸400×400px,只能上传jpg/png文件，
            且不超过3MB）
          </p>
        </template>
      </van-cell>
      <van-divider />
      <div class="d-flex align-items-center">
        <div class="addSku-btu mr-2" @click="addSku">新增套餐</div>
        <div class="addSku-btu mr-2" @click="delSku" v-if="skuKey > 0">删除套餐</div>
        <van-checkbox
          v-model="skuItem.checked"
          :name="skuItem.checked"
          checked-color="#eb6133"
          @change="skuChange"
          >选择当前套餐为主sku
        </van-checkbox>
      </div>
    </van-form>
    <!-- <van-divider/> -->
    <!-- 礼券方式 -->
    <van-popup
      v-model="showIntegralType"
      position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <van-picker
        title="礼券方式"
        show-toolbar
        :columns="integralTypekColumns"
        @confirm="onConfirmIntegralType"
        @cancel="showIntegralType = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'goodsSkuItem',
  props: {
    // SKU 套餐信息
    skuItem: {
      type: Object,
      default: () => {
        return {
          integralName: '赠送礼券',
          integral: 0
        }
      }
    },
    look: {
      type: Boolean,
      default: false
    },
    // 当前表单Key
    skuKey: Number,
    disabled: Boolean
  },
  data () {
    return {
      showIntegralType: false,
      isAndroid: !!window.jsObj,
      uploader1: [],
      integralTypekColumns: ['抵扣礼券', '赠送礼券']
      // ischecked: false
    }
  },
  mixins: ['mixins'],
  created () {
    window.androidResponse = this.androidResponse
    if (this.skuItem.skuImg) {
      this.uploader1 = [{ url: this.skuItem.skuImg }]
    }
    this.skuItem.integralName = this.skuItem.integralType === 1 ? this.integralTypekColumns[1] : this.integralTypekColumns[0]
  },
  methods: {
    // * Android 回调函数
    androidResponse (obj) {
      if (obj.type === 'skuImg') {
        this.$set(this.skuItem, 'skuImg', obj.imgPath)
        this.uploader1 = [{ url: obj.imgPath }]
      }
    },
    // app端缩略图图片预览
    ImagePreview1 () {
      ImagePreview([this.skuItem.skuImg])
    },
    deleteUploader1 () {
      this.skuItem.skuImg = null
    },
    // 缩略图
    onOversize1 (file) {
      this.$toast('缩略图大小不能超过 3MB')
    },
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 4)
    },
    // 礼券方式弹框
    onConfirmIntegralType (value, index) {
      this.skuItem.integralType = index
      this.skuItem.integralName = value
      this.showIntegralType = false
    },
    /** 添加套餐 */
    addSku () {
      if (!this.skuItem.skuName) return this.$toast('套餐名称不能为空')
      if (!this.skuItem.amount) return this.$toast('库存数量不能为空')
      const numzz = /(^[1-9]\d*$)/
      if (!numzz.test(this.skuItem.amount)) return this.$toast('请输入正确库存数量')
      if (!this.skuItem.marketPrice) return this.$toast('原价不能为空')
      const zz = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (!zz.test(this.skuItem.marketPrice)) {
        return this.$toast('请输入正确的价格')
      }
      if (!this.skuItem.salePrice) return this.$toast('销售价不能为空')
      if (!zz.test(this.skuItem.salePrice)) {
        return this.$toast('请输入正确的价格')
      }
      if (!this.skuItem.quota) return this.$toast('限购数量不能为空')
      if (!numzz.test(this.skuItem.quota)) return this.$toast('请输入正确限购数量')
      if (!this.skuItem.integral) return this.$toast('礼券数量不能为空')
      if (!/(^[0-9]\d*$)/.test(this.skuItem.integral)) return this.$toast('请输入正确礼券数量')
      if (!this.skuItem.skuImg) return this.$toast('套餐缩略图不能为空')
      this.skuItem.checked = false
      this.$emit('addSku')
    },
    skuChange (e) {
      // console.log(e)
      // this.skuItem.checked = e
      this.$emit('skuChange', this.skuKey, e)
    },
    /** 删除套餐 */
    delSku () {
      this.$emit('delSku', this.skuKey)
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.goodsSkuItem {

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
    background: linear-gradient(180deg, #f1722c 0%, #eb6133 100%);
    border-radius: 41px;
    line-height: 38px;
    color: #fff;
    text-align: center;
  }
}
</style>
