<!-- 商户类型选择 -->
<template>
  <div class="mchType">
    <van-nav-bar
      v-if="$store.state.isH5"
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="$baseUtils.goBack(-1)"
    />
    <div
      v-for="(item, index) in mchTypeList"
      :key="index"
      class="card"
      v-show="index !== 2"
    >
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
  name: 'mchType',
  data () {
    return {
      mchTypeList: ['企业', '个体工商户', '党政、机关及事业单位', '小微商户']
    }
  },
  // mounted () {
  //   console.log(this.$store.state.isH5)
  // },
  methods: {
    toPage (index) {
      this.$lance.setData('mchType', index)
      this.$store.dispatch('mchType', index)
      this.$router.push({
        name: index === 2 || index === 3 ? 'storeRegister' : 'accountType'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.mchType {
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
