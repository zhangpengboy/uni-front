<!-- 店铺信息 -->
<template>
  <div>
    <van-cell title="店铺头像"
              center>
      <template #right-icon>
        <van-image round
                   width="1.28rem"
                   height="1.28rem"
                   :src="require('@/assets/images/logo.png')" />
      </template>
    </van-cell>
    <br />
    <van-cell-group>
      <van-cell title="店铺名称"
                :value="storeInfo.storeName"
                is-link
                to="updateStoreName" />
      <van-cell title="店铺类型"
                :value="storeInfo.storeRoleName" />
      <van-cell title="店铺地址"
                center
                is-link
                to="storeLocation">
        <template #default>
          <p class="fs-14 text-left color-muted">{{ location }}</p>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'storeInfo',
  data () {
    return {
      storeInfo: {},
      location: ''
    }
  },
  created () {
    this.storeInfo = this.$lance.getJson('storeInfo')
    this.location = `${this.storeInfo.area1Name || ''}${this.storeInfo.area2Name || ''}${this.storeInfo.area3Name || ''}${this.storeInfo.area4Name || ''}${this.storeInfo.storeAddress || ''}`
  },
  activated () {
    this.storeInfo = this.$lance.getJson('storeInfo')
    this.location = `${this.storeInfo.area1Name || ''}${this.storeInfo.area2Name || ''}${this.storeInfo.area3Name || ''}${this.storeInfo.area4Name || ''}${this.storeInfo.storeAddress || ''}`
  }
}
</script>
