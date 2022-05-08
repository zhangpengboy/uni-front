<!-- 账户类型 -->
<template>
  <div class="accountType">
    <van-nav-bar
      v-if="$store.state.isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <div v-for="(item, index) in accountTypeList" :key="index" class="card">
      <p
        class="d-flex align-items-center justify-content-between fw-700"
        @click="toPage(index)"
      >
        <span>{{ item }}</span>
        <van-icon name="arrow" />
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'accountType',
  data () {
    return {
      accountTypeList: ['对公', '对私', '非法人']
      // accountTypeList: ['对公', '对私']
    }
  },
  created () {
    if (this.$lance.getData('mchType').toString() === '1') {
      this.accountTypeList.splice(0, 1)
    }
    if (this.$lance.getData('mchType').toString() === '0') {
      this.accountTypeList.splice(2, 1)
    }
  },
  methods: {
    toPage (index) {
      if (this.$lance.getData('mchType').toString() === '1') {
        index++
      }
      this.$lance.setData('accountType', index)
      this.$store.dispatch('accountType', index)
      this.$router.push({
        name: 'storeRegister'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.accountType {
  height: calc(100vh - 0px);
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
