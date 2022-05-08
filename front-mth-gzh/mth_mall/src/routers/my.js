/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 我的 页面相关路由
 */
export default [
  {
    path: '/userInfo',
    name: 'userInfo',
    meta: {
      title: '我的资料',
      noAuth: false
    },
    component: () => import('@/views/home/my/userInfo')
  },
  {
    path: '/myQR',
    name: 'myQR',
    meta: {
      title: '我的邀请码',
      noAuth: false
    },
    component: () => import('@/views/home/my/myQR')
  },
  {
    path: '/wallet',
    name: 'wallet',
    meta: {
      title: '我的钱包',
      noAuth: false
    },
    component: () => import('@/views/home/my/wallet')
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    meta: {
      title: '提现',
      noAuth: false
    },
    component: () => import('@/views/home/my/withdraw')
  },
  {
    path: '/bindingZFB',
    name: 'bindingZFB',
    meta: {
      title: '绑定支付宝',
      noAuth: false
    },
    component: () => import('@/views/home/my/bindingZFB')
  },
  {
    path: '/isBindZFB',
    name: 'isBindZFB',
    meta: {
      title: '支付宝',
      noAuth: false
    },
    component: () => import('@/views/home/my/isBindZFB')
  },

  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '明细',
      noAuth: false
    },
    component: () => import('@/views/home/my/detail')
  },
  {
    path: '/giftCer',
    name: 'giftCer',
    meta: {
      title: '我的礼券',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftCer')
  },
  {
    path: '/storeList',
    name: 'storeList',
    meta: {
      title: '我的关注',
      noAuth: false
    },
    component: () => import('@/views/home/my/storeList')
  },
  {
    path: '/favorite',
    name: 'favorite',
    meta: {
      title: '我的收藏',
      noAuth: false
    },
    component: () => import('@/views/home/my/favorite')
  },
  {
    path: '/orderList',
    name: 'orderList',
    meta: {
      title: '订单列表',
      noAuth: false
    },
    component: () => import('@/views/home/my/orderList')
  },
  {
    path: '/gift',
    name: 'gift',
    meta: {
      title: '数字货架',
      noAuth: false
    },
    component: () => import('@/views/home/my/gift')
  },
  {
    path: '/signIn',
    name: 'signIn',
    meta: {
      title: '我的云店',
      noAuth: false
    },
    component: () => import('@/views/home/my/signIn')
  },
  {
    path: '/site',
    name: 'site',
    meta: {
      title: '地址管理',
      noAuth: false
    },
    component: () => import('@/views/home/my/site')
  },
  {
    path: '/siteEdit',
    name: 'siteEdit',
    meta: {
      title: '编辑收货地址',
      noAuth: false
    },
    component: () => import('@/views/home/my/siteEdit')
  },
  {
    path: '/award',
    name: 'award',
    meta: {
      title: '业务员奖励',
      noAuth: false
    },
    component: () => import('@/views/home/my/award')
  },
  {
    path: '/salesmanSetup',
    name: 'salesmanSetup',
    meta: {
      title: '业务员设置',
      noAuth: false
    },
    component: () => import('@/views/home/my/award/salesmanSetup')
  },
  {
    path: '/addmanager',
    name: 'addmanager',
    meta: {
      title: '添加业务经理',
      noAuth: false
    },
    component: () => import('@/views/home/my/award/addmanager')
  },
  {
    path: '/addSalesman',
    name: 'addSalesman',
    meta: {
      title: '添加业务员',
      noAuth: false
    },
    component: () => import('@/views/home/my/award/addSalesman')
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    meta: {
      title: '订单详情',
      noAuth: false
    },
    component: () => import('@/views/home/my/orderDetail')
  },
  {
    path: '/fukubukuro',
    name: 'fukubukuro',
    meta: {
      title: '礼券福袋',
      noAuth: false
    },
    component: () => import('@/views/home/my/fukubukuro')
  },
  {
    path: '/retroactive',
    name: 'retroactive',
    meta: {
      title: '签到记录',
      noAuth: false
    },
    component: () => import('@/views/home/my/retroactive')
  },
  {
    path: '/set',
    name: 'set',
    meta: {
      title: '设置',
      noAuth: false
    },
    component: () => import('@/views/home/my/set')
  },
  {
    path: '/giftMother',
    name: 'giftMother',
    meta: {
      title: '个人云创业',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftMother')
  },
  {
    path: '/giftMotherBackstage',
    name: 'giftMotherBackstage',
    meta: {
      title: '个人云创业',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftMotherBackstage')
  },
  {
    path: '/giftMotherEnter',
    name: 'giftMotherEnter',
    meta: {
      title: '个人云创业入驻',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftMotherEnter')
  },
  {
    path: '/protocol',
    name: 'protocol',
    meta: {
      title: '个人云创业入驻协议',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftMotherEnter/protocol')
  },
  {
    path: '/gather',
    name: 'gather',
    meta: {
      title: '礼券余额',
      noAuth: false
    },
    component: () => import('@/views/home/my/gather')
  },
  // 礼包
  {
    path: '/giftbag',
    name: 'giftbag',
    meta: {
      title: '礼券福袋',
      noAuth: false
    },
    component: () => import('@/views/home/my/giftbag')
  },
  // 店铺订单
  {
    path: '/storeOrderDetails',
    name: 'storeOrderDetails',
    meta: {
      title: '店铺订单',
      noAuth: false
    },
    component: () => import('@/views/home/my/storeOrderDetails')
  }
]
