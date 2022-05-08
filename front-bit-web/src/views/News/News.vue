<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-20 18:55:24
 * @Description : 资讯中心
-->
<template>
  <div class="news">
    <div class="news-banner">
      <p>INFORMATION</p>
      <h1>资讯中心</h1>
    </div>

    <div class="container">
      <!-- tabs 导航 -->
      <div class="container-wrap jms-tabs">
        <span
          class="jms-tabs-bar"
          :class="i === active ? 'active' : ''"
          v-for="(v, i) in navList"
          :key="i"
          @click="hanlderTab(i)"
        >
          {{ v.name }}
        </span>
      </div>

      <!-- 新闻列表 -->
      <!-- <NewsPicker :items="items" @play="playVideo" /> -->
      <NewsPicker :items="items" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import NewsPicker from '@/views/News/components/NewsPicker.vue';
import { TabsConf } from '@/types/TabsConf';
import { NewsConf } from '@/types/NewsConf';
export default Vue.extend({
  name: 'News',
  components: {
    NewsPicker,
  },
  data() {
    return {
      active: 0 as number,
      navList: [] as TabsConf[],
      items: [] as NewsConf[]
    };
  },
  created() {
    // 获取本地数据
    Axios.get('/json/news.json').then(res => {
      console.log(this.active)
      if (res.status === 200) {
        this.navList = res.data;
        this.items = this.navList[this.active].items
      }
    });
  },
  methods: {
    /** tab切换 */
    hanlderTab(index: number) {
      this.active = index;
      this.items = this.navList[this.active].items
    },
  },
});
</script>
<style lang="less" scoped>
.news {
  &-banner {
    height: 420px;
    background: url('~@/assets/images/video/bg-banner.png') no-repeat;
    background-size: cover;
    color: #fff;
    text-align: center;
    p {
      padding-top: 200px;
      font-size: 22px;
      color: #f8f8f8;
      margin-bottom: 14px;
    }
    h1 {
      font-size: 42px;
    }
  }
  .container {
    margin-bottom: 60px;
  }
}
</style>
