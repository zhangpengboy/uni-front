/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 公共页面相关路由
 */
export default [
  // 头部搜索
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '商品搜索',
      noAuth: true
    },
    component: () => import('@/views/search')
  },
  // 搜索跳转详情
  {
    path: '/searchList',
    name: 'searchList',
    meta: {
      noAuth: true
    },
    component: () => import('@/views/search/searchList')
  },
  // 精品推荐，活动相关页面
  {
    path: '/recommend',
    name: 'recommend',
    meta: {
      title: '精品推荐',
      noAuth: true
    },
    component: () => import('@/views/webView/recommend')
  }, // 商品详情
  {
    path: '/commodity',
    name: 'commodity',
    meta: {
      title: '商品详情',
      noAuth: true
    },
    component: () => import('@/views/webView/commodity')
  },
  // 店铺详情
  {
    path: '/storeData',
    name: 'storeData',
    meta: {
      title: '店铺详情',
      noAuth: false
    },
    component: () => import('@/views/webView/storeData')
  },
  // 店铺宝贝
  {
    path: '/storeGoodsBaby',
    name: 'storeGoodsBaby',
    meta: {
      title: '便利店',
      noAuth: false
    },
    component: () => import('@/views/webView/storeGoodsBaby')
  },
  // 店铺宝贝确定订单
  {
    path: '/confirmOrder',
    name: 'confirmOrder',
    meta: {
      title: '确认订单',
      noAuth: false
    },
    component: () => import('@/views/webView/confirmOrder')
  },
  // 确认订单
  {
    path: '/submitOrder',
    name: 'submitOrder',
    meta: {
      title: '确认订单',
      noAuth: false
    },
    component: () => import('@/views/webView/submitOrder')
  },
  // 街市支付
  {
    path: '/storeGoodsPay',
    name: 'storeGoodsPay',
    meta: {
      title: '确认订单',
      noAuth: false
    },
    component: () => import('@/views/webView/storeGoodsPay')
  },
  // 365礼包充值
  {
    path: '/recharge',
    name: 'recharge',
    meta: {
      title: '充值365',
      noAuth: false
    },
    component: () => import('@/views/webView/recharge')
  },
  // 支付
  {
    path: '/aiipay',
    name: 'aiipay',
    meta: {
      title: '支付',
      noAuth: false
    },
    component: () => import('@/views/webView/aiipay')
  },
  // 完成支付
  {
    path: '/accomplish',
    name: 'accomplish',
    meta: {
      title: '支付成功',
      noAuth: false
    },
    component: () => import('@/views/webView/accomplish')
  }
]
