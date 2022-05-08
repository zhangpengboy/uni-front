<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-26 20:38:30
 * @Description : 我的-订单列表
-->
<template>
  <div class="order">
    <van-nav-bar
      title="订单列表"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    <van-sticky offset-top="1.22667rem">
      <van-tabs
        v-model="activeParent"
        @click="onParentClick"
        sticky
        color="#EB6133"
        title-active-color="#EB6133"
        title-inactive-color="#666"
      >
        <van-tab
          v-for="index in statusParentList"
          :key="index"
          :title="index"
        ><div class="centxt"></div></van-tab>
      </van-tabs>
    </van-sticky>
    <goods-order-list v-if="activeParent === 0"></goods-order-list>
    <store-order-list v-if="activeParent === 1"></store-order-list>
  </div>
</template>

<script>
import goodsOrderList from './goodsOrderList.vue'
import storeOrderList from './storeOrderList.vue'
export default {
  components: {
    goodsOrderList,
    storeOrderList
  },
  data () {
    return {
      activeParent: 0,
      statusParentList: ['商城订单', '店铺订单']
    }
  },
  created () {
  },
  methods: {
    // 返回的位置判断
    onClickLeft () {
      this.$router.push('my')
    },
    // 切换订单类型
    onParentClick (name) {
      this.activeParent = name
    }
  }
}
</script>

<style lang="scss" scoped>
.centxt {
  width: 100%;
  height: 4px;
  background: #fff;
}
</style>
