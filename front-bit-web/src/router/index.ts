/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-21 14:05:11
 * @Description : 路由管理
 */
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/Product/Product')
  },
  {
    path: '/productDetail',
    name: 'ProductDetail',
    component: () => import('@/views/Product/ProductDetail.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/views/Videos/Video.vue')
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News/News.vue')
  },
  {
    path: '/newsDetail',
    name: 'NewsDetail',
    component: () => import('@/views/News/NewsDetail.vue')
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('@/views/Download/Download.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由跳转滚动到顶部
router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
