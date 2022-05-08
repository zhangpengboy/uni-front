<!-- 结算账户相关表单项 -->
<template>
  <div class="colseAccount backgroundWhite">
    <van-form validate-first>
      <van-field
        label-class="color-333"
        v-model="form.accountName"
        clearable
        :readonly="readonly"
        input-align="right"
        placeholder="请输入开户名(账户名称)"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.zbankRegionName"
        readonly
        clickable
        right-icon="arrow"
        input-align="right"
        @click="onArea"
        placeholder="请选择开户银行支行区域"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.zbankName"
        clearable
        input-align="right"
        placeholder="请选择开户银行支行"
        readonly
        right-icon="arrow"
        @click="onZbankClick"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.accountNo"
        clearable
        input-align="right"
        :readonly="readonly"
        placeholder="请输入银行卡号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行卡号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="form.resserveMobile"
        type="tel"
        clearable
        input-align="right"
        :readonly="readonly"
        placeholder="请输入银行预留手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行预留手机号</span>
        </template>
      </van-field>
      <van-cell title="银行卡正面照">
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
        title="请选择开户银行支行区域码"
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
  name: 'colseAccount',
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
      regBankNo: /^[1-9]\d{9,29}$/,
      regPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      value: '',
      onZbank: false,
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
      if (newName.imgList.filter(item => item.name === 'bankCard').length > 0) {
        this.uploader = [
          {
            url: newName.imgList.filter(item => item.name === 'bankCard')[0].url
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
      this.form.zbankNo = this.zbankList[index].branchCode
      this.form.zbankName = this.zbankList[index].branchName
      // this.form.zbankRegionCode = this.form.areaNo
      // this.form.zbankRegionName = this.form.areaNo
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
      this.form.zbankRegionCode = selectedOptions[selectedOptions.length - 1].id
      this.form.zbankRegionName = `${selectedOptions[0].value}-${selectedOptions[1].value}-${selectedOptions[2].value}`
    },
    // 银行卡正面照
    onOversize1 (file) {
      this.$toast('银行卡正面照大小不能超过 10MB')
    },
    // 银行卡正面照
    afterReadUploader1 (File) {
      if (Array.isArray(File)) {
        return this.$toast('只能上传一张图片')
      }
      this.afterReadUploader(File, 5, 'bankCard')
    },
    deleteUploader1 (file, detail) {
      this.form.imgList = _.assign(
        [],
        this.form.imgList.filter(item => item.name !== 'bankCard')
      )
    },
    submitForm () {
      if (!this.form.accountName) return this.$toast('开户名不能为空')
      if (!this.form.zbankNo) return this.$toast('开户银行支行号不能为空')
      if (!this.form.zbankRegionCode) {
        return this.$toast('开户银行支行区域码不能为空')
      }
      if (!this.form.resserveMobile) {
        return this.$toast('银行预留手机号不能为空')
      }
      if (!this.regPhone.test(this.form.resserveMobile)) {
        return this.$toast('法人手机号不正确')
      }
      if (!this.form.accountNo) return this.$toast('银行卡号不能为空')
      if (!this.regBankNo.test(this.form.accountNo)) {
        return this.$toast('银行卡号不正确')
      }
      if (
        this.form.imgList.filter(item => item.name === 'bankCard').length === 0
      ) {
        return this.$toast('请上传银行卡照片')
      }
      this.$emit('colseAccountFormData', this.form)
      // this.$lance.setJson('colseAccountFormData', this.form)
    },
    lastStep () {
      this.$emit('colseAccountLastStep')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
</style>
