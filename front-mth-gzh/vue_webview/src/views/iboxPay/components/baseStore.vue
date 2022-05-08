<!-- baseStore -->
<template>
  <div class="backgroundWhite">
    <van-form validate-first>
      <van-field
        label-class="color-333"
        clickable
        :readonly="readonly"
        v-model="form.mchtName"
        input-align="right"
        placeholder="请输入商户名称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户名称</span>
        </template>
      </van-field>
      <p v-if="$lance.getData('mchType') === '1'" class="fs-12 color-light p-3">
        若个体工商户营业执照没有商家名称或名称为“ * ”或者“ ***
        ”，则商户名称应填“个体户XXX”(XXX为营业执照上经营者姓名)
      </p>
      <van-field
        label-class="color-333"
        clickable
        :readonly="readonly"
        v-model="form.mchtCnShortName"
        input-align="right"
        placeholder="请输入商户简称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户简称</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.areaName"
        readonly
        clickable
        right-icon="arrow"
        input-align="right"
        @click="onArea"
        placeholder="请选择经营区域"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>经营地区</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.address"
        clickable
        :readonly="readonly"
        input-align="right"
        placeholder="请输入商户门店地址"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>商户门店地址</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        readonly
        clickable
        v-model="form.businessName"
        right-icon="arrow"
        input-align="right"
        placeholder="请选择经营范围"
        @click="onStoreCate"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>经营范围</span>
        </template>
      </van-field>
      <van-cell title="场景照片">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <p class="fs-13 m-1">门头照</p>
          <van-uploader
            v-model="uploader1"
            multiple
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :deletable="!readonly"
          />
          <p class="fs-13 m-1">收银台照</p>
          <van-uploader
            v-model="uploader2"
            multiple
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize2"
            :after-read="afterReadUploader2"
            @delete="deleteUploader2"
            :deletable="!readonly"
          />
          <p class="fs-13 m-1">内景含商品照</p>
          <van-uploader
            v-model="uploader3"
            multiple
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize3"
            :after-read="afterReadUploader3"
            @delete="deleteUploader3"
            :deletable="!readonly"
          />
          <div v-if="$lance.getData('mchType').toString() === '3'">
            <p class="fs-13 m-1">合伙人商户合影照</p>
            <van-uploader
              v-model="uploader4"
              multiple
              :max-count="1"
              :max-size="1024 * 1024 * 10"
              @oversize="onOversize4"
              :after-read="afterReadUploader4"
              @delete="deleteUploader4"
              :deletable="!readonly"
            />
          </div>
          <p class="fs-13 color-c1">(只能上传jpg/png文件，且不超过10M)</p>
        </template>
      </van-cell>
    </van-form>
    <van-button
      class="but mt-4"
      round
      block
      type="info"
      @click="submitForm"
      :disabled="disabled"
      >立即注册</van-button
    >
    <van-button
      class="but bg-primary ball my-4"
      round
      block
      type="info"
      @click="lastStep"
      >上一步</van-button
    >
    <!-- 地址 -->
    <van-popup v-model="showArea" position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="showArea = false"
        @finish="onFinish"
        :field-names="fieldNames"
      />
    </van-popup>
    <!-- 经营范围 -->
    <van-popup v-model="showStoreCate" position="bottom">
      <van-cascader
        v-model="storeCateValue"
        title="请选择经营范围"
        :options="optionsStoreCate"
        @close="showStoreCate = false"
        @finish="onFinishStoreCate"
        :field-names="fieldNamesStoreCate"
      />
    </van-popup>
  </div>
</template>

<script>
import city from '@/utils/city.json'
export default {
  name: 'baseStore',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      uploader1: [],
      uploader2: [],
      uploader3: [],
      uploader4: [],
      // readonly: false, // 小微商户名称固定： 商户_xx(身份证名称)
      showArea: false,
      cascaderValue: '',
      showStoreCate: false,
      storeCateValue: '',
      options: null,
      optionsStoreCate: null,
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      fieldNamesStoreCate: {
        text: 'name',
        value: 'id',
        children: 'children'
      }
      // form: {
      //   imgList: []
      // }
    }
  },
  watch: {
    form (newName, oldName) {
      // console.log(newName.imgList.filter(item => item.name === 'shopFrontImg'))
      if (
        newName.imgList.filter(item => item.name === 'shopFrontImg').length > 0
      ) {
        this.uploader1 = [
          {
            url: newName.imgList.filter(item => item.name === 'shopFrontImg')[0]
              .url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'checkstandImg').length > 0
      ) {
        this.uploader2 = [
          {
            url: newName.imgList.filter(
              item => item.name === 'checkstandImg'
            )[0].url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'shopInnerImg').length > 0
      ) {
        this.uploader3 = [
          {
            url: newName.imgList.filter(item => item.name === 'shopInnerImg')[0]
              .url
          }
        ]
      }
      if (
        newName.imgList.filter(item => item.name === 'operatorMcht').length > 0
      ) {
        this.uploader4 = [
          {
            url: newName.imgList.filter(item => item.name === 'operatorMcht')[0]
              .url
          }
        ]
      }
    }
  },

  methods: {
    // 点击地区
    onArea () {
      if (!this.readonly) {
        this.showArea = true
        this.options = city
      }
    },
    // 点击经营范围
    onStoreCate () {
      if (!this.readonly) {
        this.$http.post(
          this.$apiUri.APP_IBOXPAY_STORECATELIST,
          null,
          res => {
            this.showStoreCate = true
            this.optionsStoreCate = res.data
          },
          err => {
            this.$toast(err.message)
          }
        )
      }
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      // console.log(selectedOptions)
      this.showArea = false
      this.form.areaNo = selectedOptions[selectedOptions.length - 1].id
      // this.form.zbankRegionCode = this.form.areaNo
      this.form.areaName = `${selectedOptions[0].value}-${selectedOptions[1].value}-${selectedOptions[2].value}`
    },
    // 选择经营范围
    onFinishStoreCate ({ selectedOptions }) {
      // console.log(selectedOptions)
      this.showStoreCate = false
      this.form.businessId = selectedOptions[selectedOptions.length - 1].id
      this.form.businessName = selectedOptions[selectedOptions.length - 1].name
    },
    // 门头照
    onOversize1 (file) {
      this.$toast('门头照大小不能超过 10MB')
    },
    // 收银台
    onOversize2 (file) {
      this.$toast('收银台照片大小不能超过 10MB')
    },
    // 内景含商品照
    onOversize3 (file) {
      this.$toast('内景含商品照片大小不能超过 10MB')
    },
    // 合伙人合影
    onOversize4 (file) {
      this.$toast('合伙人合影照片大小不能超过 10MB')
    },
    // 场景店铺-门头照
    afterReadUploader1 (File) {
      this.afterReadUploader(File, 12, 'shopFrontImg')
    },
    afterReadUploader2 (File) {
      this.afterReadUploader(File, 12, 'checkstandImg')
    },
    afterReadUploader3 (File) {
      this.afterReadUploader(File, 12, 'shopInnerImg')
    },
    afterReadUploader4 (File) {
      this.afterReadUploader(File, 12, 'operatorMcht')
    },
    deleteUploader1 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'shopFrontImg')
      )
    },
    deleteUploader2 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'checkstandImg')
      )
    },
    deleteUploader3 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'shopInnerImg')
      )
    },
    deleteUploader4 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'operatorMcht')
      )
    },
    submitForm () {
      if (!this.form.mchtName) return this.$toast('商户名称不能为空')
      if (!this.form.mchtCnShortName) return this.$toast('商户简称不能为空')
      if (!this.form.areaNo) return this.$toast('经营地区区域码不能为空')
      if (!this.form.address) return this.$toast('商户门店地址不能为空')
      if (!this.form.businessId) return this.$toast('经营范围不能为空')
      if (
        this.form.imgList.filter(item => item.name === 'shopFrontImg')
          .length === 0
      ) {
        return this.$toast('请上传门头照')
      }
      if (
        this.form.imgList.filter(item => item.name === 'checkstandImg')
          .length === 0
      ) {
        return this.$toast('请上传收银台照片')
      }
      if (
        this.form.imgList.filter(item => item.name === 'shopInnerImg')
          .length === 0
      ) {
        return this.$toast('请上传内景含商品照片')
      }
      if (
        this.$lance.getData('mchType').toString() === '3' &&
        this.form.imgList.filter(item => item.name === 'operatorMcht')
          .length === 0
      ) {
        return this.$toast('请上传合伙人商户合影照片')
      }
      this.$emit('baseStoreFormData', this.form)
      // this.$lance.setJson('baseStoreFormData', this.form)
    },
    lastStep () {
      this.$emit('baseStoreLastStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
