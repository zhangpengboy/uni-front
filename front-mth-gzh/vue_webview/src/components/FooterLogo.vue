<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-21 17:38:03
 * @Description  : 底部LOGO
-->
<template>
  <div class="footerLogo">
    <!-- <van-divider>

    </van-divider> -->
    <div class="logo">
      <div class="hr"></div>
      <!-- <img src="@/assets/images/tabbar/icon_logo@2x.png" alt=""/> -->
      <div class="hr"></div>
    </div>
    <p class="footer_p">全球领先的矿机租赁 算力交易平台</p>
  </div>
</template>

<script>
export default {
  name: 'FooterLogo',
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.footerLogo {
    margin-top: 12px;
    .logo{
      display: flex;
      justify-content: center;
      align-items: center;
      .hr {
        width: 48px;
        height: 1px;
        background: #D9D9D9;
        margin: 0 12px;
      }
      img {
        width: 20%;
      }
    }

  .footer_p {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin: 8px 0 62px 0;
  }
}
</style>
