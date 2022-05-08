<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-27 15:34:16
 * @Description : 产品介绍
-->
<template>
  <div class="container">
    <div class="container-wrap goods-introduce">
      <!-- 产品介绍 头部 -->
      <div class="goods-introduce-head">
        <div class="goods-title">产品介绍</div>
        <el-popover width="200" trigger="hover">
          <div slot="reference" class="goods-erm">
            <span>手机购买</span>
            <img src="@/assets/images/download@2x.png" />
            <i class="el-icon-arrow-down"></i>
          </div>
          <img class="goods-erm-big" src="@/assets/images/download@2x.png" alt="" />
        </el-popover>
      </div>

      <!-- 产品信息 -->
      <div class="goods-introduce-wrap">
        <div class="introduce-name">产品信息</div>
        <div class="introduce-row">
          <div class="introduce-col">
            <span>产品类型：</span>
            <span>普通包</span>
          </div>
          <div class="introduce-col">
            <span>产品期限：</span>
            <span>180天</span>
          </div>
        </div>
        <div class="introduce-row">
          <div class="introduce-col">
            <span>利息处理方式：</span>
            <span>转入余额通或提取至账户</span>
          </div>
          <div class="introduce-col">
            <span>到期处理方式：</span>
            <span>到期自动退押金还息</span>
          </div>
        </div>
      </div>

      <!-- 产品介绍 -->
      <div class="goods-introduce-wrap">
        <div class="introduce-name">产品介绍</div>
        <div class="introduce-body">
          <p>
            基于比特币实体矿机的定期存取产品，投资周期较为灵活，30天~720天不等，产品收益远高于余额通，适合对资金流动性要求较低且追求更高收益的群体。基于比特币实体矿机的定期存取产品，投资周期较为灵活，30天~720天不等，产品收益远高于余额通，适合对资金流动性要求较低且追求更高收益的群体。基于比特币实体矿机的定期存取产品，投资周期较为灵活，30天~720天不等，产品收益远高于余额通，适合对资金流动性要求较低且追求更高收益的群体。
          </p>
          <p>
            基于比特币实体矿机的定期存取产品，投资周期较为灵活，30天~720天不等，产品收益远高于余额通，适合对资金流动性要求较低且追求更高收益的群体。
          </p>
          <p>
            基于比特币实体矿机的定期存取产品，投资周期较为灵活，30天~720天不等，产品收益远高于余额通，适合对资金流动性要求较低且追求更高收益的群体。
          </p>
        </div>
      </div>

      <!-- 计息 -->
      <div class="goods-introduce-wrap">
        <div class="introduce-name">计息</div>
        <div class="introduce-steps">
          <StepsBlock
            :item="item"
            v-for="(item, index) in bearList"
            :key="index"
          />
        </div>
      </div>

      <!-- 购买流程 -->
      <div class="goods-introduce-wrap">
        <div class="introduce-name">购买流程</div>
        <div class="introduce-steps">
          <StepsBlock
            :item="item"
            v-for="(item, index) in buyProList"
            :key="index"
          />
        </div>
      </div>

      <!-- 相关协议 -->
      <div class="goods-introduce-wrap">
        <div class="introduce-name">相关协议</div>
        <div class="introduce-body">
          <router-link :to="v.path" v-for="(v, i) in serviceList" :key="i">
            {{ v.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import StepsBlock from '@/views/Product/components/StepsBlock.vue';
export default Vue.extend({
  name: 'GoodsIntroduce',
  components: {
    StepsBlock,
  },
  data() {
    return {
      bearList: [
        { sn: 1, title: '当天加入20:00前', isPic: false },
        { sn: 1, title: '', isPic: true },
        { sn: 2, title: '计算收益T+3日', isPic: false },
        { sn: 2, title: '', isPic: true },
        { sn: 3, title: '服务到期自动退出', isPic: false },
      ],
      buyProList: [
        { sn: 1, title: '注册账户', isPic: false },
        { sn: 1, title: '', isPic: true },
        { sn: 2, title: '实名认证', isPic: false },
        { sn: 2, title: '', isPic: true },
        { sn: 3, title: '投入金额', isPic: false },
        { sn: 3, title: '', isPic: true },
        { sn: 4, title: '购买', isPic: false },
      ],
      serviceList: [
        {
          name: '《风险揭示书》',
          path: { name: 'service', query: { id: 10001 } },
        },
        {
          name: '《合租挖矿协议》',
          path: { name: 'service', query: { id: 10002 } },
        },
      ],
    };
  },
});
</script>
<style lang="less" scoped>
@import '../Product';
</style>
