<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-24 18:46:32
 * @Description : 新闻组件
-->
<template>
  <div class="container-wrap news-layout">
    <router-link
      tag="div"
      class="news-wrap"
      :to="`newsDetail?code=${v.code}&id=${v.id}`"
      v-for="(v, i) in list"
      :key="i"
    >
      <div class="news-wrap-pic">
        <img :src="v.image" />
      </div>
      <div class="news-wrap-content">
        <h2 class="news-title">{{ v.title }}</h2>
        <p class="news-time">{{ moment(v.date).format('YYYY.MM.DD') }}</p>
        <p class="news-desc">{{ v.desc }}</p>
      </div>
    </router-link>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { NewsConf } from '@/types/NewsConf';
export default Vue.extend({
  name: 'NewsPicker',
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    list() {
      return this.items as NewsConf[];
    },
  },
  methods: {
    moment,
  },
});
</script>
<style lang="less" scoped>
.news-layout {
  .news-wrap {
    position: relative;
    display: flex;
    margin-bottom: 40px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      background: #ffffff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      transform: translate3d(0, -2px, 0);

      .news-wrap-pic img {
        transform: scale(1.2);
      }

      .news-title {
        color: #1e74e4;
      }
      .news-desc {
        color: #333333;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }

    &-pic {
      width: 288px;
      height: 168px;
      overflow: hidden;
      img {
        transition: all 0.3s;
      }
    }

    &-content {
      flex: 1;
      padding-left: 24px;
      padding-right: 24px;
      overflow: hidden;
      .news-title,
      .news-desc {
        padding-top: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        transition: color 0.3s ease-in-out;
      }
      .news-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 25px;
      }
      .news-time {
        padding-top: 12px;
        font-size: 14px;
        line-height: 20px;
        color: #999999;
      }
      .news-desc {
        line-height: 22px;
        color: #666666;
      }
    }
  }
}
</style>
