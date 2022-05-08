/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-25 13:38:41
 * @Description  : 模拟后台返回的异步路由
 */
import Layout from '@/layout/index'
// 公共路由
export const asyncRoutes = [
  // * 商户中心
  {
    path: '/mallcenter',
    component: Layout,
    redirect: "noRedirect",
    name: 'Mallcenter',
    meta: { title: '商户中心', icon: 'shop' },
    alwaysShow: true,
    children: [
      {
        path: 'stores',
        name: 'stores',
        component: (resolve) => require(['@/views/mallcenter/stores/index'], resolve),
        meta: { title: '店铺列表', icon: 'form' }
      },
    ]
  },
  // * 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Goods',
    meta: { title: '商品管理', icon: 'shopping' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'GoodsIndex',
        
        component: (resolve) => require(['@/views/goods/index/index'], resolve),
        meta: { title: '商品列表', icon: 'list', noCache: false }
      },
      {
        path: 'detail',
        name: 'GoodsDetail',
        hidden: true,
        component: (resolve) => require(['@/views/goods/index/detail'], resolve),
        meta: { title: '商品详情', icon: 'plus', noCache: true }
      },
      
    ]
  },
  // * 营销管理
  {
    path: '/market',
    component: Layout,
    redirect: '/market/index',
    name: 'Market',
    meta: { title: '营销管理', icon: 'server' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'MarketIndex',
        component: (resolve) => require(['@/views/market/index'], resolve),
        meta: { title: '活动中心', icon: 'list', noCache: true }
      },
      {
        path: 'goods',
        name: 'MarketGoods',
        hidden: true,
        component: (resolve) => require(['@/views/market/goods/index'], resolve),
        meta: { title: '商品列表', noCache: true }
      },
      {
        path: 'recommended',
        name: 'MarketRecommended',
        component: (resolve) => require(['@/views/market/recommended/index'], resolve),
        meta: { title: '店铺装饰',icon: 'list', noCache: true }
      },
      {
        path: 'banner',
        name: 'MarketBanner',
        hidden: true,
        component: (resolve) => require(['@/views/market/banner/index'], resolve),
        meta: { title: '广告图列表', noCache: true }
      },
      {
        path: 'pushGoodsList',
        name: 'PushGoodsList',
        component: (resolve) => require(['@/views/market/pushGoodsList'], resolve),
        meta: { title: '数字货架', icon: 'shop' }
      },
      {
        path: 'pushGoods',
        name: 'MarketPushGoods',
        hidden: true,
        component: (resolve) => require(['@/views/market/pushGoods/index'], resolve),
        meta: { title: '代买店铺', noCache: true }
      },
    ]
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/index',
    name: 'Orders',
    meta: { title: '订单管理', icon: 'example' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'OrdersIndex',
        component: (resolve) => require(['@/views/orders/index'], resolve),
        meta: { title: '订单列表', icon: 'list' }
      },
      {
        path: 'detail',
        name: 'OrdersDetail',
        hidden: true,
        component: (resolve) => require(['@/views/orders/detail'], resolve),
        meta: { title: '订单详情', noCache: true }
      },
      {
        path: 'apply',
        name: 'OrdersApply',
        component: (resolve) => require(['@/views/orders/apply/index'], resolve),
        meta: { title: '退款订单', icon: 'list' }
      },
    ]
  },
]