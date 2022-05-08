<!-- 修改店铺名称 -->
<template>
  <div class=''>
    <van-nav-bar
      :title="$route.meta.title"
      right-text="确定"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <van-cell-group>
      <van-field v-model="storeName" label="" placeholder="请输入店铺名称" maxlength="14" clearable/>
    </van-cell-group>
    <p class="fs-14 mt-2 ml-3 color-muted">限1~14个字符。</p>
  </div>
</template>

<script>
export default {
  name: 'updateStoreName',
  data () {
    return {
      storeName: '',
      regStr: /^[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\\A9|\\AE]\u3030|\uA9|\uAE|\u3030$/
    }
  },
  created () {
    this.storeName = this.$lance.getJson('storeInfo').storeName
  },
  methods: {
    onClickLeft () {
      this.$baseUtils.goBack(-1)
    },
    onClickRight () {
      if (!this.storeName) {
        return this.$toast('店铺名称不能为空')
      }
      if (this.regStr.test(this.storeName)) return this.$toast('店铺名称不能输入表情字符')
      const parameters = this.$lance.getJson('storeInfo')
      parameters.storeName = this.storeName
      this.$http.post(
        this.$apiUri.APP_STORE_INFO_UPDATE,
        parameters,
        res => {
          this.$lance.setJson('storeInfo', parameters)
          this.$toast('店铺名称修改成功')
          this.$baseUtils.goBack(-1)
        }, err => {
          this.$toast(err.message)
        }
      )
    }
  }
}
</script>
<style lang='scss' scoped>
// @import url(); 引入公共css类

</style>
