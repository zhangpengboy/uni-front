<!-- 开户许可证相关表单项 -->
<template>
  <div class="licence backgroundWhite">
    <van-form validate-first>
      <van-field
        label-class="color-333"
        v-model="form.openBankAccName"
        clearable
        input-align="right"
        :readonly="readonly"
        placeholder="请输入开户许可证-开户名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.openUnionNo"
        clearable
        input-align="right"
        readonly
        right-icon="arrow"
        @click="onZbankClick"
        placeholder="请输入开户许可证-开户支行"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户支行</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.openBankAccout"
        type="tel"
        clearable
        :readonly="readonly"
        input-align="right"
        placeholder="请输入开户许可证-银行卡号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行卡号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.openBankRegionCode"
        readonly
        clickable
        right-icon="arrow"
        input-align="right"
        @click="onArea"
        placeholder="请输入开户许可证-银行地区码"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行地区码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.openCollectBankCode"
        clearable
        readonly
        input-align="right"
        placeholder="请输入开户许可证-银行代码"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行代码</span>
        </template>
      </van-field>
      <van-cell title="开户许可证">
        <template #icon>
          <span class="color-danger">*</span>
        </template>
        <template #label>
          <van-uploader
            v-model="uploader"
            :max-count="1"
            :max-size="1024 * 1024 * 10"
            @oversize="onOversize1"
            :after-read="afterReadUploader1"
            @delete="deleteUploader1"
            :deletable="!readonly"
          />
          <p class="fs-13 color-c1">（只能上传jpg/png文件，且不超过10M）</p>
        </template>
      </van-cell>
    </van-form>
    <van-button class="but mt-4" round block type="info" @click="submitForm"
      >下一步</van-button
    >
    <van-button
      class="but bg-primary ball my-4"
      round
      block
      type="info"
      @click="lastStep"
      >上一步</van-button
    >
    <!-- 开户银行支行信息查询弹框 -->
    <van-popup
      v-model="onZbank"
      position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true"
    >
      <form action="/">
        <van-search
          v-model="value"
          placeholder="请输入支行名称"
          @search="onSearch"
        />
      </form>
      <van-picker
        title=""
        show-toolbar
        :columns="columnsZbank"
        @confirm="onConfirmZbank"
        @cancel="onZbank = false"
      />
    </van-popup>
    <!-- 开户银行支行区域码 -->
    <van-popup v-model="showArea" position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择开户银行地区码"
        :options="options"
        @close="showArea = false"
        @finish="onFinish"
        :field-names="fieldNames"
      />
    </van-popup>
  </div>
</template>

<script>
import city from '@/utils/city.json'
export default {
  name: 'licence',
  props: {
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploader: [],
      onZbank: false,
      value: '',
      columnsZbank: [],
      zbankList: [],
      showArea: false,
      options: null,
      cascaderValue: '',
      fieldNames: {
        text: 'value',
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
      if (
        newName.imgList.filter(item => item.name === 'openAccountLicenses')
          .length > 0
      ) {
        this.uploader = [
          {
            url: newName.imgList.filter(
              item => item.name === 'openAccountLicenses'
            )[0].url
          }
        ]
      }
    }
  },
  methods: {
    onZbankClick () {
      if (!this.readonly) {
        this.onZbank = true
      }
    },
    // 搜索查询开户银行支行信息
    onSearch (val) {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_QUERY_BRANCHBANK,
        { name: val },
        res => {
          this.zbankList = res.data
          this.columnsZbank = res.data.map(item => item.branchName)
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 确认开户银行支行号
    onConfirmZbank (value, index) {
      // this.form.zbankNo = value
      this.form.openUnionNo = this.zbankList[index].branchCode
      this.form.openCollectBankCode = this.zbankList[index].mainCode
      this.form.zbankNo = this.zbankList[index].branchCode
      this.form.zbankName = this.zbankList[index].branchName
      this.onZbank = false
    },
    // 点击地区
    onArea () {
      if (!this.readonly) {
        this.showArea = true
        this.options = city
      }
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.form.openBankRegionCode =
        selectedOptions[selectedOptions.length - 1].id
      this.form.zbankRegionCode = selectedOptions[selectedOptions.length - 1].id
    },
    // 开户许可证
    onOversize1 (file) {
      this.$toast('开户许可证图片大小不能超过 10MB')
    },
    // 开户许可证
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 13, 'openAccountLicenses')
    },
    deleteUploader1 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'openAccountLicenses')
      )
    },
    submitForm () {
      if (!this.form.openBankAccName) {
        return this.$toast('开户许可证-开户名不能为空')
      }
      if (!this.form.openBankAccout) {
        return this.$toast('开户许可证-银行卡号不能为空')
      }
      if (!this.form.openBankRegionCode) {
        return this.$toast('开户许可证-银行地区码不能为空')
      }
      if (!this.form.openCollectBankCode) {
        return this.$toast('开户许可证-银行代码不能为空')
      }
      if (!this.form.openUnionNo) {
        return this.$toast('开户许可证-开户支行不能为空')
      }
      this.form.accountNo = this.form.openBankAccout
      this.form.accountName = this.form.openBankAccName
      this.$emit('licenceFormData', this.form)
    },
    lastStep () {
      this.$emit('licenceLastStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
