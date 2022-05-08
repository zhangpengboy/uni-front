<!-- 设置 -->
<template>
  <div class='set'>
    <van-cell title="修改登录密码" is-link to="edit"/>
    <van-cell title="店铺信息" is-link to="storeInfo"/>
    <!-- <van-cell title="收货地址" is-link to="location"/> -->
    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      @click="quit"
      class="mt-8 but"
      >退出登录</van-button
    >
  </div>
</template>

<script>
export default {
  name: 'set',
  data () {
    return {}
  },
  created () {},
  methods: {
    // 退出登录
    quit () {
      this.$dialog
        .confirm({
          message: '确定要退出登录吗？'
        })
        .then(() => {
          this.$store.dispatch('loginOut')
        })
        .catch(() => {})
    }
  }
}
</script>
