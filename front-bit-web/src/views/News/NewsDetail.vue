<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-25 14:51:37
 * @Description : 新闻详情
-->
<template>
  <div class="news-detail">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="news-detail-rumb"
    >
      <div class="container">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/news' }">
          新闻资讯
        </el-breadcrumb-item>
        <el-breadcrumb-item>文章详情</el-breadcrumb-item>
      </div>
    </el-breadcrumb>
    <!-- 内容 -->
    <div class="container">
      <div class="news-detail-body">
        <h1 class="detail-title">{{ detail.title }}</h1>
        <p class="detail-date">{{ detail.date }}</p>
        <div class="detail-content" v-html="detail.html"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { NewsConf } from '@/types/NewsConf';
import Axios from 'axios';
import Vue from 'vue';
import { get, find } from 'lodash';
import { TabsConf } from '@/types/TabsConf';

export default Vue.extend({
  name: 'newsDetail',
  data() {
    return {
      query: {} as any,
      detail: {} as NewsConf,
    };
  },
  mounted() {
    this.query = this.$route.query;
    // 获取本地数据
    Axios.get<TabsConf[]>('/json/news.json').then(({ data }) => {
      const temp = find(data, v => v.code === this.query.code);
      this.detail =
        get(temp!, 'items', []).find(
          (item: { id: number }) => item.id === +this.query.id
        ) || ({} as NewsConf);
    });
  },
});
</script>
<style lang="less" scoped>
.news-detail {
  &-rumb {
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #eeeeee;
  }

  &-body {
    padding-top: 50px;
    max-width: 820px;
    margin: 0 auto;
    .detail-title {
      font-size: 34px;
      line-height: 48px;
      text-align: center;
      margin-bottom: 30px;
    }

    .detail-date {
      font-size: 14px;
      color: #999999;
      line-height: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e6e6e6;
    }

    .detail-content {
      padding-top: 40px;
      padding-bottom: 60px;
      /deep/ p {
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
