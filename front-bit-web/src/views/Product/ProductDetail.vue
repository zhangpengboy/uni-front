<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-27 11:30:48
 * @Description : 产品详情
-->
<template>
  <div class="product-detail">
    <!-- 导航 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="product-detail-rumb"
    >
      <div class="container">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product' }">
          产品中心
        </el-breadcrumb-item>
        <el-breadcrumb-item>产品详情</el-breadcrumb-item>
      </div>
    </el-breadcrumb>

    <div class="container">
      <!-- 合租挖矿 -->
      <CoTenantBlock />
      <!-- 共享算力 -->
      <ShareBlock />
    </div>

    <!-- 产品介绍 -->
    <GoodsIntroduce />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import CoTenantBlock from '@/views/Product/components/CoTenantBlock.vue';
import ShareBlock from '@/views/Product/components/ShareBlock.vue';
import GoodsIntroduce from '@/views/Product/components/GoodsIntroduce.vue';
export default Vue.extend({
  name: 'ProductDetail',
  components: {
    CoTenantBlock,
    ShareBlock,
    GoodsIntroduce,
  },
  data() {
    return {
      items: {}
    };
  },
  mounted() {

  },
});
</script>
<style lang="less" scoped>
.product-detail {
  padding-bottom: 60px;
  &-rumb {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
