<!-- 用户类型选择 -->
<template>
  <div class='userType'>
    <div v-for="(item, index) in userTypeList" :key="index" class="card">
      <p class="d-flex align-items-center justify-content-between fw-700" @click="toPage(index)">
        <span>{{ item }}</span>
        <van-icon name="arrow" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userType',
  data () {
    return {
      userTypeList: ['企业', '个人', '个体工商户']
    }
  },
  mounted () {
    this.getMchDetail()
  },
  methods: {
    toPage (index) {
      this.$lance.setData('userType', index + 1)
      this.$store.dispatch('userType', index + 1)
      this.$router.push('mchLedgerRegister')
    },
    // 获取商户进件信息
    getMchDetail () {
      this.$http.post(
        this.$apiUri.APP_IBOXPAY_DETAIL,
        { storeId: this.$lance.getData('storeId') },
        (res) => {
          this.$lance.setData('merchantCode', res.data.mchtNo)
          this.$lance.setData('mchtName', res.data.mchtName)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类
.userType {
  height: calc(100vh - 46px);
  padding: 14px;
  .card {
    width: 100%;
    height: 100px;
    line-height: 76px;
    border-radius: 8px;
    border: 1px solid #fff;
    background: #fff;
    padding: 12px;
    margin-bottom: 10px;
  }
}
</style>
