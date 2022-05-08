<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-26 20:38:30
 * @Description : 地址管理
-->
<template>
  <div class="site">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <van-cell-group v-if="dataOK || addressList.length > 0">
      <van-cell
        v-for="(v, i) in addressList"
        :key="i"
        @click="selectSite(v)"
        center
      >
        <template #title>
          <span class="userName mr-2">{{ v.userName }}</span>
          <span class="phone">{{ v.phone }}</span>
        </template>
        <template #label>
          <div style="display: flex">
            <div class="abcdefg" v-if="v.status === 1">默认</div>
            <div class="address">{{ v.address }}</div>
          </div>
        </template>
        <template #right-icon>
          <van-icon name="edit" size="0.6rem" @click.stop="toPage(v)" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty
      v-else
      class="custom-image"
      :image="require('@/assets/images/empty/no_location@2x.png')"
      description="您还未添加收货地址"
    />
    <van-button
      color="linear-gradient(180deg, #F1722C 0%, #EB6133 100%)"
      block
      size="small"
      round
      to="/siteEdit"
      class="but footer"
      >新建收货地址</van-button
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSelect: false,
      addressList: [],
      dataOK: true,
      isBack: true, // 是否是返回上一页面
      fromName: null
    }
  },
  created () {
    if (this.$route.query.type === 'select') {
      this.isSelect = true
      // this.$lance.setData('isSelect', "submitOrder")
    }
    // this.getAddressList()
  },
  activated () {
    // console.log(3210, this.$route.query)
    this.getAddressList()
  },
  // beforeDestroy() {
  //   console.log(0,this.isBack);
  //   if(!this.isBack) {
  //     this.$lance.clearStorage('isSelect')
  //   }
  // },
  methods: {
    // 跳转地址编辑页面
    toPage (v) {
      console.log(2132321, v)
      this.$router.push({
        path: '/siteEdit',
        query: {
          id: v.id
        }
      })
    },
    // 是否需要返回地址(从订单确认页跳过来选收货地址)
    selectSite (v) {
      if (this.isSelect) {
        this.$lance.setJson('select_address', v)
        // console.log(this.isSelect)
        this.$router.go(-1)
        // this.$router.push({
        //   path: '/submitOrder'
        // })
      }
    },
    // 获取用户地址列表
    getAddressList () {
      this.$http.post(
        this.$apiUri.APP_ADDRESSLIST,
        null,
        (res) => {
          this.dataOK = false
          this.addressList = res.data
          console.log(11111, res)
        },
        (err) => {
          this.$toast(err.message)
        }
      )
    },
    // 返回
    onClickLeft () {
      // console.log(777,this.$lance.getData('isSelect'))
      // console.log(this.fromName);// || !this.fromName
      if (this.isBack) {
        this.$baseUtils.goBack(-1)
      } else {
        // this.$router.replace(this.fromName)
        this.$router.go(-1)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // console.log("to", to.name);
    // console.log('from',from.name)
    if (from.name === 'siteEdit') {
      // console.log("111111");
      return next((vm) => {
        vm.isBack = false
      })
    }
    next((vm) => {
      // console.log("2222222222");
      vm.fromName = from.name
      // vm.$lance.setJson('isSelect', from.name)
    })
  }
}
</script>

<style scoped>
.userName {
  font-size: 14px;
  color: #333;
}
.phone {
  font-size: 14px;
  color: #999;
}
.address {
  width: 275px;
  font-size: 13px;
  color: #333;
  font-weight: 700;
  /* 这两个在技术上是一样的, 为了兼容了浏览器两个都加上 */
  overflow-wrap: break-word;
  word-wrap: break-word;
  -ms-word-break: break-all;
  /* 这个的使用在web-kit中有些危险，他可能会阶段所有东西 */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;
  /* 如果浏览器支持的话增加一个连接符(Blink不支持) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
.abcdefg {
  min-width: 40px;
  height: 18px;
  color: #fff;
  text-align: center;
  line-height: 18px;
  margin-right: 10px;
  background: #eb6133;
  opacity: 1;
  border-radius: 2px;
}
</style>
