<!-- 注册分账账户 -->
<template>
  <div class="mchLedgerRegister">
    <business-info
      v-if="userType.toString() !== '2'"
      @businessInfoForm="businessInfoForm"
      :disabled="disabled"
    />
    <user-info v-else @userInfoForm="userInfoForm" :disabled="disabled" />
  </div>
</template>

<script>
import businessInfo from './components/businessInfo.vue'
import userInfo from './components/userInfo.vue'
import { mapState } from 'vuex'
export default {
  name: 'mchLedgerRegister',
  components: {
    businessInfo,
    userInfo
  },
  data () {
    return {
      disabled: false,
      form: {}
    }
  },
  computed: {
    ...mapState(['userType'])
  },
  created () {},
  methods: {
    businessInfoForm (data) {
      this.form.businessInfo = _.assign({}, data)
      this.subForm()
    },
    userInfoForm (data) {
      this.form.userInfo = _.assign({}, data)
      this.subForm()
    },
    subForm () {
      this.form.merchantCode = this.$lance.getData('merchantCode')
      this.form.platUserName = this.$lance.getData('mchtName')
      this.form.isOpenPwd = '2'
      this.form.userType = this.userType
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_MCHLEDGERREGISTER,
        this.form,
        res => {
          this.$toast({
            message: '分账账户注册资料提交成功，请耐心等待审核~',
            duration: 5000
          })
          this.disabled = true
          this.$lance.setData('userId', res.data.userId)
          // this.$router.push('/')
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
</style>
