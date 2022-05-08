<!-- 分账账户-用户类型：个人-相关表单项 -->
<template>
  <div class='backgroundWhite'>
    <van-form validate-first>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.userName"
        input-align="right"
        placeholder="请输入用户姓名"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>用户姓名</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.certId"
        input-align="right"
        placeholder="请输入用户的身份证号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>身份证号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        type="tel"
        v-model="userInfo.userMobile"
        input-align="right"
        placeholder="请输入用户的手机号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>手机号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        v-model="userInfo.bankName"
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
        v-model="userInfo.bankBranchName"
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
        v-model="userInfo.countyAreaCode"
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
        v-model="userInfo.cardNo"
        input-align="right"
        placeholder="请输入用户的银行卡号"
      >
        <template #label>
          <span class="color-danger">*</span>
          <span>银行卡号</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.valiDate"
        input-align="right"
        placeholder="格式：20200101-20300101"
      >
        <template #label>
          <span>证件有效期</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.custAddress"
        input-align="right"
        placeholder="请输入证件上的地址"
      >
        <template #label>
          <span>住址</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.professional"
        input-align="right"
        placeholder="请输入职业"
      >
        <template #label>
          <span>职业</span>
        </template>
      </van-field>
      <van-field
        label-class="color-333"
        clickable
        v-model="userInfo.userEmail"
        input-align="right"
        placeholder="请输入邮箱"
      >
        <template #label>
          <span>邮箱</span>
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
        <van-search v-model="value" placeholder="请输入支行名称" @search="onSearch"/>
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
  name: 'userInfo',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: '',
      columnsZbank: [],
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
      userInfo: {}
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
      this.userInfo.bankCode = this.zbankList[index].mainCode
      this.userInfo.bankName = this.zbankList[index].mainName
      this.userInfo.bankBranchCode = this.zbankList[index].branchCode
      this.userInfo.bankBranchName = this.zbankList[index].branchName
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
      this.userInfo.countyAreaCode = selectedOptions[selectedOptions.length - 1].id
    },
    submitForm () {
      if (!this.userInfo.userName) return this.$toast('用户名称不能为空')
      if (!this.userInfo.certId) return this.$toast('用户身份证号不能为空')
      if (!this.userInfo.userMobile) return this.$toast('用户身手机号不能为空')
      if (!this.userInfo.bankName) return this.$toast('开户银行名称不能为空')
      if (!this.userInfo.bankBranchName) return this.$toast('开户银行支行名称不能为空')
      if (!this.userInfo.countyAreaCode) return this.$toast('支行地区码不能为空')
      if (!this.userInfo.cardNo) return this.$toast('用户的银行卡号不能为空')
      this.$emit('userInfoForm', this.userInfo)
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
</style>
