<template>
  <div>
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <van-cell title="收货地址" is-link to="/site" />
      <van-cell
        title="业务员设置"
        v-if="ispartner == 4"
        is-link
        to="/salesmanSetup"
      />
    </van-cell-group>
    <van-cell center title="数字货架收费设置" v-if="!this.issaleman">
      <template #right-icon>
        <van-switch v-model="isStatus" @click="change" size="0.64865rem" active-color="#eb6133"/>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ispartner: 0,
      isStatus: false,
      issaleman: false,
      isBack: true
    }
  },
  created () {
    this.getUsermallUser()
    this.getDigitalShelves()
  },
  methods: {
    getUsermallUser () {
      this.$http.post(this.$apiUri.APP_USERGET, {}, res => {
        if (res.success) {
          this.ispartner = res.data.roleCode
        }
      })
    },
    change (e) {
      console.log(1, e)
      let status = e.detail.value ? 1 : 0
      this.$http.post(this.$apiUri.APP_UPDATESHELVES, { status }, res => {
        console.log(status)
        setTimeout(function () {
          this.isStatus = !this.isStatus
        }, 800)
      })
    },
    getDigitalShelves () {
      this.$http.post(this.$apiUri.APP_SHELVES, {}, res => {
        console.log(112, res)
        if (res.success) {
          this.isStatus = res.data.status === 1
          this.issaleman = res.data.salesman
        } else {
          this.$toast(res.message)
        }
      })
    },
    onClickLeft () {
      if (this.isBack) {
        this.$baseUtils.goBack(-1)
      } else {
        // console.log('2222222');
        this.$router.go(-1)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'site') {
      next(vm => {
        vm.isBack = false
      })
    }
    next()
  }
}
</script>
