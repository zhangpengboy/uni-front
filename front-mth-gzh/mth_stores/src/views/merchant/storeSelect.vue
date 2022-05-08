<template>
  <div class="store">
    <router-link
      tag="div"
      class="box"
      v-for="(item, i) in storeList"
      :key="i"
      :to="{ path: item.path, query: item.query }"
    >
      <div class="make" :style="{ background: item.bg }">
        {{ item.name }}
      </div>
      <van-cell class="cell" center :title="item.storeName" is-link />
    </router-link>
    <div class="myButtom">
      <van-button class="round" @click="openShop" round type="info"
        >申请开通店铺</van-button
      >
      <van-button class="info" @click="quit" round type="info"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      phone: '',
      storeList: []
    }
  },
  computed: {
    ...mapState(['storeQuery'])
  },
  mounted () {
    if (this.storeQuery.type === '1') {
      this.phone = this.storeQuery.phone
    } else {
      this.phone = this.$route.query.phone
        ? this.$route.query.phone
        : this.$lance.getData('phone')
    }
    this.getStoreInfoByPhone()
  },

  methods: {
    // 开通店铺
    openShop () {
      this.$router.push({
        name: 'inApplication',
        query: {
          type: 'create'
        }
      })
    },
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
    },
    // 获取店铺信息
    getStoreInfoByPhone () {
      this.$http.post(
        this.$apiUri.APP_ADD_UPDTA_SROREINFO_PHONE,
        { phone: this.phone },
        (res) => {
          _.map(res.data, (v) => {
            switch (v.status) {
              case 0:
                // v.path = '/assetsIndex'
                v.path = v.storeRoleCode === 1 ? 'assetsIndex' : '/my'
                v.query = { storeId: v.id }
                v.bg = '#ffffff'
                v.name = ''
                v.enable = true
                break
              case 1:
                v.path = '/waitReview'
                v.query = { storeId: v.id }
                v.bg = '#fba440'
                v.name = '待审核'
                v.enable = true
                break
              case 2:
                v.path = '/refuse'
                v.query = {
                  storeId: v.id,
                  phone: this.phone
                }
                v.bg = '#F53232'
                v.name = '未通过'
                v.enable = true
                break
              case 3:
                v.path = '/close'
                v.query = { storeId: v.id }
                v.bg = '#C1C1C1'
                v.name = '已禁用'
                v.enable = false
                break
            }
            // console.log(1, v.id)
          })
          this.storeList = res.data
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.store {
  padding-bottom: 50px;
}
.info {
  width: 140px;
  height: 38px;
  opacity: 1;
  margin-left: 16px;
  background-color: #fff;
  border: 1px solid #fff;
  color: #666666;
  border-radius: 41px;
}
.round {
  width: 140px;
  margin-left: 40px;
  color: #ed6133;
  background-color: #fff;
  border: 1px solid #fff;
  height: 38px;
  opacity: 1;
  border-radius: 41px;
}
.myButtom {
  position: fixed;
  background-color: #f7f7f7;
  width: 100%;
  height: 60px;
  bottom: 0px;
  z-index: 1000;
  padding-top: 6px;
  display: flex;
  align-items: center;
}
.make {
  width: 86px;
  height: 19px;
  line-height: 19px;
  // background: #fba440;
  opacity: 1;
  border-radius: 8px 0px 0px 0px;
  text-align: center;
  color: #ffffff;
}
.box {
  width: 351px;
  height: 76px;
  margin: 12px auto;
  overflow: hidden;
  background: #ffffff;
  opacity: 1;
  border-radius: 8px;
}
.cell {
  font-weight: 300;
  font-size: 16px;
  color: #333333;
}
</style>
