<!-- 商户注册表单信息 -->
<template>
  <div class="storeRegister">
    <van-nav-bar
      v-if="$store.state.isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <div class="showStatus" v-if="showStatus">
      {{ `${status}：${statusText}` }}
    </div>
    <userCard
      @userCardFormData="userCardFormData"
      v-show="showUserCardForm"
      :form="form"
      :readonly="readonly"
    />
    <business
      @businessFormData="businessFormData"
      @businessLastStep="businessLastStep"
      v-if="businessFlag"
      v-show="showBusinessForm"
      :form="form"
      :readonly="readonly"
    />
    <licence
      @licenceFormData="licenceFormData"
      @licenceLastStep="licenceLastStep"
      v-if="licenceFlag"
      v-show="showLicenceForm"
      :form="form"
      :readonly="readonly"
    />
    <colse-account
      @colseAccountFormData="colseAccountFormData"
      @colseAccountLastStep="colseAccountLastStep"
      v-if="colseAccountFlag"
      v-show="showColseAccountForm"
      :form="form"
      :readonly="readonly"
    />
    <assist
      @assistFormData="assistFormData"
      @assistLastStep="assistLastStep"
      v-if="assistFlag"
      v-show="showAssistForm"
      :form="form"
      :readonly="readonly"
    />
    <base-store
      @baseStoreFormData="baseStoreFormData"
      @baseStoreLastStep="baseStoreLastStep"
      v-show="showBaseStoreForm"
      :disabled="disabled"
      :readonly="readonly"
      :form="form"
    />
  </div>
</template>

<script>
import business from './components/business.vue'
import userCard from './components/userCard.vue'
import licence from './components/licence.vue'
import colseAccount from './components/colseAccount.vue'
import assist from './components/assist.vue'
import baseStore from './components/baseStore.vue'
import { mapState } from 'vuex'
export default {
  name: 'storeRegister',
  components: {
    business,
    userCard,
    licence,
    colseAccount,
    assist,
    baseStore
  },
  data () {
    return {
      form: { imgList: [] },
      disabled: false,
      readonly: false,
      showUserCardForm: true, // 是否显示身份证
      showBusinessForm: false, // 是否显示营业执照
      showLicenceForm: false, // 是否显示开户许可证
      showColseAccountForm: false, // 是否显示结算账户
      showAssistForm: false, // 是否显示辅助证明材料表单（被委托人信息、委托协议书等）
      showBaseStoreForm: false, // 是否显示商户基本信息(商户名称、门头照等)
      statusMsg: ['待审核', -'审核中', '审核被拒绝', '审核通过', '审核异常'],
      statusText: '',
      showStatus: false // 是否显示审核状态
    }
  },
  computed: {
    ...mapState(['mchType', 'accountType']),
    // 加载营业执照表单组件
    businessFlag: function () {
      return this.mchType.toString() !== '3'
    },
    // 加载开户许可证表单组件
    licenceFlag: function () {
      return (
        (this.mchType.toString() === '0' &&
          this.accountType.toString() === '0') ||
        this.mchType.toString() === '2' ||
        (this.mchType.toString() === '0' && this.accountType.toString() === '2')
      )
    },
    // 加载结算账户表单组件
    colseAccountFlag: function () {
      return !(
        (this.mchType.toString() === '0' &&
          this.accountType.toString() === '0') ||
        this.mchType.toString() === '2'
      )
    },
    // 加载辅助证明材料表单组件
    assistFlag: function () {
      return (
        (this.mchType.toString() === '0' &&
          this.accountType.toString() === '2') ||
        (this.mchType.toString() === '1' && this.accountType.toString() === '2')
      )
    }
  },
  created () {
    // if (this.mchType === '2' || this.mchType === '3') {
    //   this.showUserCardForm = true
    // }
    // console.log('mchType:', this.mchType.toString())
    // console.log('accountType:', this.accountType.toString())
    // console.log('营业执照:', this.businessFlag)
    // console.log('开户许可证:', this.licenceFlag)
    // console.log('结算账户:', this.colseAccountFlag)
    // console.log('辅助证明材料:', this.assistFlag)
    this.getMchDetail()
  },
  mounted () {
    if (this.$lance.getData('mchType') === '3') {
      this.readonly = true
    }
  },
  methods: {
    // 合并提交参数
    mergeParameter (data) {
      Object.getOwnPropertyNames(data).forEach(key => {
        if (key === 'imgList') {
          data.imgList.forEach(item => {
            this.form.imgList.forEach((v, i) => {
              if (item.name === v.name) {
                this.form.imgList.splice(i, 1)
              }
            })
            this.form.imgList.push(item)
          })
        } else {
          this.form[key] = data[key]
        }
      })
      // console.log(this.form)
    },
    // 身份证下一步
    userCardFormData (data) {
      this.form = _.assign({}, data)
      this.showUserCardForm = false
      if (this.businessFlag) {
        this.showBusinessForm = true
        return
      }
      if (this.licenceFlag) {
        this.showLicenceForm = true
        return
      }
      if (this.colseAccountFlag) {
        this.showColseAccountForm = true
      }
    },
    // 营业执照下一步
    businessFormData (data) {
      this.mergeParameter(data)
      this.showBusinessForm = false
      if (this.licenceFlag) {
        this.showLicenceForm = true
        return
      }
      if (this.colseAccountFlag) {
        this.showColseAccountForm = true
      }
    },
    // 营业执照上一步
    businessLastStep () {
      this.showBusinessForm = false
      this.showUserCardForm = true
    },
    // 开户许可证下一步
    licenceFormData (data) {
      this.mergeParameter(data)
      this.showLicenceForm = false
      if (this.colseAccountFlag) {
        this.showColseAccountForm = true
        return
      }
      this.showBaseStoreForm = true
    },
    // 开户许可证上一步
    licenceLastStep () {
      this.showLicenceForm = false
      // this.showBusinessForm = true
      if (this.businessFlag) {
        this.showBusinessForm = true
      }
    },
    // 结算账户下一步
    colseAccountFormData (data) {
      this.mergeParameter(data)
      this.showColseAccountForm = false
      if (this.assistFlag) {
        this.showAssistForm = true
        return
      }
      this.showBaseStoreForm = true
    },
    // 结算账户上一步
    colseAccountLastStep () {
      this.showColseAccountForm = false
      if (this.licenceFlag) {
        this.showLicenceForm = true
        return
      }
      if (this.businessFlag) {
        this.showBusinessForm = true
        return
      }
      this.showUserCardForm = true
    },
    // 辅助材料下一步
    assistFormData (data) {
      this.mergeParameter(data)
      this.showAssistForm = false
      this.showBaseStoreForm = true
    },
    // 辅助材料上一步
    assistLastStep () {
      this.showAssistForm = false
      this.showColseAccountForm = true
    },
    // 商户基本信息上一步
    baseStoreLastStep () {
      this.showBaseStoreForm = false
      if (this.assistFlag) {
        this.showAssistForm = true
        return
      }
      if (this.colseAccountFlag) {
        this.showColseAccountForm = true
        return
      }
      if (this.licenceFlag) {
        this.showLicenceForm = true
      }
    },
    // 商户基本信息下一步(立即注册)
    baseStoreFormData (data) {
      this.mergeParameter(data)
      this.form.channelKind =
        this.mchType.toString() === '3' ? '002113' : '002205'
      this.form.licenceType = this.mchType
      this.form.accountType = this.accountType
      this.form.storeId = this.$lance.getData('storeId')
      // console.log(this.form)
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_MCHREGISTER,
        this.form,
        res => {
          this.$toast({
            message: '商户注册资料提交成功，请耐心等待审核~',
            duration: 5000
          })
          this.disabled = true
          // this.form = {}
          // this.$router.push('/')
        },
        err => {
          this.$toast(err.message)
        }
      )
    },
    // 获取商户进件信息
    getMchDetail () {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_DETAIL,
        { storeId: this.$lance.getData('storeId') },
        res => {
          if (!res.data) return
          // 回显对应类型的数据
          if (
            this.mchType.toString() === res.data.licenceType &&
            this.accountType.toString() === res.data.accountType
          ) {
            if (res.data.status === '3' || res.data.status === '5') {
              this.$toast({ message: res.data.reason, duration: 5000 })
            } else {
              this.disabled = true
              this.readonly = true
            }
            this.showStatus = true
            this.status = this.statusMsg[res.data.status * 1 - 1]
            this.statusText = res.data.reason
            this.form = _.assign({}, res.data)
            this.form.imgList = JSON.parse(res.data.images)
          }
        },
        err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.storeRegister {
  .showStatus {
    width: 100%;
    min-height: 36px;
    font-size: 14px;
    background: #eb6133;
    color: #fff;
    line-height: 36px;
    text-align: left;
    padding-left: 20px;
  }
}
</style>
