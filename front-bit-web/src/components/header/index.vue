<!--
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-22 10:24:44
 * @Description : 顶部导航条
-->
<template>
  <div class="app-header">
    <div class="app-header-content">
      <div class="logo">
        <img src="@/assets/logo.png" alt="掘金所" />
      </div>
      <div class="nav-list">
        <span v-for="(v, i) in navList" :key="i">
          <router-link :to="v.path" :class="v.isActive ? 'on' : ''">
            {{ v.title }}
          </router-link>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { RouteConf } from '@/types/RouteConf';
import produce from 'immer';
export default Vue.extend({
  name: 'AppHeader',
  data() {
    return {
      navList: [
        { title: '首页', path: '/', isActive: true },
        { title: '产品中心', path: '/product', isActive: false },
        { title: '视频中心', path: '/video', isActive: false },
        { title: '新闻资讯', path: '/news', isActive: false },
        { title: 'APP下载', path: '/download', isActive: false },
        { title: '关于我们', path: '/about', isActive: false },
      ] as RouteConf[],
    };
  },
  watch: {
    $route(nVal) {
      this.navList.map(v => {
        if (nVal.path === v.path) {
          v.isActive = true;
        } else {
          v.isActive = false;
        }
      });
    },
  },
  methods: {
    onRouteChange(routeConf: RouteConf) {
      this.navList = produce(this.navList, draft => {
        draft.map(item => (item.isActive = routeConf.path === item.path));
      });
    },
  },
});
</script>
<style lang="less">
.app-header {
  width: 100%;
  min-width: 1200px;
  height: 88px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #f8f8f8;

  &-content {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      padding: 10px;
      img {
        width: 140px;
        height: 36px;
      }
    }
    .nav-list {
      display: flex;

      a {
        position: relative;
        color: #333333;
        padding: 15px 30px;
        text-decoration: none;
        font-weight: 550;
        &:hover {
          color: #1e74e4;
        }
        &.on {
          color: #1e74e4;
          &::after {
            content: ' ';
            position: absolute;
            width: 36%;
            height: 4px;
            background: #1e74e4;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
}
</style>
