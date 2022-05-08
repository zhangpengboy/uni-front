<!-- 分账账户-用户类型：企业/个体工商户-相关表单项 -->
<template>
  <div class='backgroundWhite'>
    <van-form validate-first>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.corpName"
        input-align="right"
        placeholder="请输入企业的公司全称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>企业名称</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.businessCode"
        input-align="right"
        placeholder="请输入企业的营业执照注册号"
      >
        <template #label>
          <span>营业执照注册号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.institutionCode"
        input-align="right"
        placeholder="请输入组织机构代码"
      >
        <template #label>
          <span>组织机构代码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.taxCode"
        input-align="right"
        placeholder="请输入企业的税务登记号"
      >
        <template #label>
          <span>税务登记号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.socialCreditCode"
        input-align="right"
        placeholder="请输入企业的统一社会信用代码"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>统一社会信用代码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.licenseStartDate"
        clearable
        input-align="right"
        type="digit"
        placeholder="格式:20210102"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>证照起始日期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.licenseEndDate"
        clearable
        input-align="right"
        type="digit"
        placeholder="格式:20210102"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>证照结束日期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.corpBusinessAddress"
        input-align="right"
        placeholder="请输入企业经营地址"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>企业经营地址</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.corpRegAddress"
        input-align="right"
        placeholder="请输入企业注册地址"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>企业注册地址</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        type="tel"
        v-model="businessInfo.corpFixedTelephone"
        input-align="right"
        placeholder="请输入企业固定电话"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>企业固定电话</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.businessScope"
        input-align="right"
        placeholder="请输入企业经营范围"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>经营范围</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.legalName"
        input-align="right"
        placeholder="请输入企业法人姓名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人姓名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.legalCertName"
        clearable
        input-align="right"
        readonly
        right-icon="arrow"
        @click="onLegalCertType=true"
        placeholder="请选择法人证件类型"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人证件类型</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.legalCertId"
        input-align="right"
        placeholder="请输入法人证件号码"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人证件号码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.legalCertStartDate"
        clearable
        input-align="right"
        type="digit"
        placeholder="格式:20210102"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人证件起始日期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.legalCertEndDate"
        clearable
        input-align="right"
        type="digit"
        placeholder="格式:20210102"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人证件结束日期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.legalMobile"
        clearable
        input-align="right"
        type="tel"
        placeholder="请输入法人手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>法人手机号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.contactName"
        clearable
        input-align="right"
        placeholder="请输入企业联系人姓名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>企业联系人姓名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.contactMobile"
        clearable
        input-align="right"
        type="tel"
        placeholder="请输入企业联系人手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>联系人手机号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.contractEmail"
        clearable
        input-align="right"
        placeholder="请输入企业联系人邮箱"
      >
        <template #label>
          <span>联系人邮箱</span>
        </template>
      </van-field>
      <van-field input-align="right"
        v-if="$lance.getData('userType').toString() === '3'"
        >
        <template #label>
          <span class="color-danger">*</span>
          <span class="color-muted3">银行账户类型</span>
        </template>
        <template #input>
          <van-radio-group v-model="businessInfo.bankAcctType" direction="horizontal" >
            <van-radio name="P" checked-color="#EB6133">对私</van-radio>
            <van-radio name="C" checked-color="#EB6133">对公</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.bankName"
        clearable
        input-align="right"
        readonly
        right-icon="arrow"
        @click="onZbank=true"
        placeholder="请选择开户银行"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行名称</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.bankBranchName"
        clearable
        input-align="right"
        placeholder="请填写开户银行支行名称"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行支行名称</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="businessInfo.countyAreaCode"
        clearable
        input-align="right"
        readonly
        right-icon="arrow"
        @click="onArea"
        placeholder="请选择支行地区码"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>支行地区码</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.bankAcctNo"
        input-align="right"
        placeholder="请输入银行账户号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行账户</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.bankAcctName"
        input-align="right"
        placeholder="请输入开户银行账户名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>开户银行账户名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="businessInfo.industry"
        input-align="right"
        placeholder="请输入行业"
      >
        <template #label>
          <span>行业</span>
        </template>
      </van-field>
    </van-form>
    <van-button class="but my-4" round block type="info" @click="submitForm" :disabled="disabled"
      >立即注册</van-button
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
        <van-search v-model="value" placeholder="请输入银行名称" @search="onSearch"/>
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
        title="请选择支行地区码"
        :options="options"
        @close="showArea = false"
        @finish="onFinish"
        :field-names="fieldNames"
    />
    </van-popup>
    <!-- 身份证类型 -->
    <van-popup v-model="onLegalCertType" position="bottom"
      round
      :close-on-popstate="false"
      :safe-area-inset-bottom="true">
      <van-picker
        title=""
        show-toolbar
        :columns="columnsLegalCertType"
        @confirm="onConfirmLegalCertType"
        @cancel="onLegalCertType = false"
      />
    </van-popup>
  </div>
</template>

<script>
import city from '@/utils/city.json'
export default {
  name: 'businessInfo',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      onLegalCertType: false,
      value: '',
      columnsZbank: [],
      columnsLegalCertType: ['身份证', '护照', '港澳台居民通行证（废弃不用）', '外国人永久居留证', '香港来往内地通行证', '澳门来往内地通行证', '台湾同胞来往内地通行证'],
      zbankList: [],
      onZbank: false,
      showArea: false,
      options: null,
      cascaderValue: '',
      fieldNames: {
        text: 'value',
        value: 'id',
        children: 'children'
      },
      businessInfo: {},
      regBankNo: /^[1-9]\d{9,29}$/,
      regPhone:
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      regSFZ: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
    }
  },
  methods: {
    // 搜索查询开户银行支行信息
    onSearch (val) {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_QUERY_BRANCHBANK,
        { name: val },
        (res) => {
          this.zbankList = res.data
          this.columnsZbank = res.data.map(item => item.branchName)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 确认开户银行支行号
    onConfirmZbank (value, index) {
      this.businessInfo.bankCode = this.zbankList[index].mainCode
      this.businessInfo.bankName = this.zbankList[index].mainName
      this.businessInfo.bankProv = this.zbankList[index].provinceName
      this.businessInfo.bankArea = this.zbankList[index].cityName
      this.businessInfo.bankBranchCode = this.zbankList[index].branchCode
      this.businessInfo.bankBranchName = this.zbankList[index].branchName
      this.onZbank = false
    },
    // 点击地区
    onArea () {
      this.showArea = true
      this.options = city
    },
    // 选择地区
    onFinish ({ selectedOptions }) {
      this.showArea = false
      this.businessInfo.countyAreaCode = selectedOptions[selectedOptions.length - 1].id
    },
    // 选择身份证类型
    onConfirmLegalCertType (value, index) {
      this.businessInfo.legalCertType = `0${index + 1}`
      this.businessInfo.legalCertName = value
      this.onLegalCertType = false
    },
    submitForm () {
      if (!this.businessInfo.corpName) return this.$toast('企业名称不能为空')
      if (!this.businessInfo.socialCreditCode) return this.$toast('统一社会信用代码不能为空')
      if (!this.businessInfo.licenseStartDate) return this.$toast('证照起始日期不能为空')
      if (!this.businessInfo.licenseEndDate) return this.$toast('证照结束日期不能为空')
      if (!this.businessInfo.corpBusinessAddress) return this.$toast('企业经营地址不能为空')
      if (!this.businessInfo.corpRegAddress) return this.$toast('企业注册地址不能为空')
      if (!this.businessInfo.corpFixedTelephone) return this.$toast('企业固定电话不能为空')
      if (!this.businessInfo.businessScope) return this.$toast('经营范围不能为空')
      if (!this.businessInfo.legalName) return this.$toast('法人姓名不能为空')
      if (!this.businessInfo.legalCertName) return this.$toast('法人证件类型不能为空')
      if (!this.businessInfo.legalCertId) return this.$toast('法人证件号码不能为空')
      if (!this.regSFZ.test(this.businessInfo.legalCertId)) {
        return this.$toast('法人证件号码不正确')
      }
      if (!this.businessInfo.legalCertStartDate) return this.$toast('法人证件起始日期不能为空')
      if (!this.businessInfo.legalCertEndDate) return this.$toast('法人证件结束日期不能为空')
      if (!this.businessInfo.legalMobile) return this.$toast('法人手机号不能为空')
      if (!this.regPhone.test(this.businessInfo.legalMobile)) {
        return this.$toast('法人手机号不正确')
      }
      if (!this.businessInfo.contactName) return this.$toast('企业联系人姓名不能为空')
      if (!this.businessInfo.contactMobile) return this.$toast('联系人手机号不能为空')
      if (!this.regPhone.test(this.businessInfo.contactMobile)) {
        return this.$toast('联系人手机号不正确')
      }
      if (this.$lance.getData('userType').toString() === '3' && !this.businessInfo.bankAcctType) {
        return this.$toast('请选择开户银行账户类型')
      }
      if (!this.businessInfo.bankName) return this.$toast('开户银行名称不能为空')
      if (!this.businessInfo.bankBranchName) return this.$toast('开户银行支行名称不能为空')
      if (!this.businessInfo.countyAreaCode) return this.$toast('支行地区码不能为空')
      if (!this.businessInfo.bankAcctNo) return this.$toast('开户银行账户不能为空')
      if (!this.regBankNo.test(this.businessInfo.bankAcctNo)) {
        return this.$toast('开户银行账户不正确')
      }
      if (!this.businessInfo.bankAcctName) return this.$toast('开户银行账户名不能为空')
      this.$emit('businessInfoForm', this.businessInfo)
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
