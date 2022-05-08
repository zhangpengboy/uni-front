<!--
 * @Author: Gmsoft - WeiHong Ran
 * @Date: 2021-03-24 09:30:13
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-27 14:14:50
 * @Description: Nothing
-->

<template>
  <div class="cloud-layout">
    <div class="cloud-title">云算力</div>
    <div class="cloud-desc">
      通过认购算力合约，即可实时开启数字货币挖矿，经由币金所专业的矿所部署和贴心服务，帮助您获得更高的挖矿收益。
    </div>
    <div class="objects-layout">
      <div v-for="item in objs" :key="item.title" class="obj-item">
        <div class="obj-icon">
          <img :src="item.icon" alt="icon" />
        </div>
        <div class="obj-title">{{ item.title }}</div>
        <div class="ojb-desc">{{ item.desc }}</div>
      </div>
    </div>
    <div class="btn-buyer">选购套餐</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface ItemConf {
  icon: string;
  title: string;
  desc: string;
}

export default Vue.extend({
  name: 'CloudeCalc',
  props: {
    items: {
      type: Array,
    },
  },
  computed: {
    objs() {
      return this.items as ItemConf[];
    },
  },
});
</script>

<style lang="less">
.cloud-layout {
  padding: 60px 0;
  text-align: center;
  .cloud-title {
    text-align: center;
    color: white;
    font-size: 32px;
    margin-bottom: 32px;
  }
  .cloud-desc {
    margin-bottom: 96px;
    text-align: center;
    color: #ddd;
    font-size: 16px;
  }
  .objects-layout {
    display: flex;
    justify-content: center;
    margin: 0 -20px 90px;
    .obj-item {
      display: flex;
      width: 170px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 116px;
      color: white;
      .obj-icon {
        display: block;
        width: 64px;
        margin-bottom: 28px;
      }
      .obj-title {
        text-align: center;
        font-size: 24px;
        margin-bottom: 15px;
      }
      .ojb-desc {
        text-align: center;
        color: #ddd;
        font-size: 14px;
        line-height: 1.4em;
      }
    }
  }
  .btn-buyer {
    display: inline-block;
    margin: 0 auto;
    padding: 16px 76px;
    color: white;
    background-color: #1e74e4;
    letter-spacing: 0.1em;
    border-radius: 3px;
    cursor: pointer;
  }
}
</style>
