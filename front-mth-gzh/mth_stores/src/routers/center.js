/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 个人中心/我的 相关路由
 */
export default [
  {
    name: 'assetsIndex',
    meta: {
      title: '资产管理',
      noAuth: false
    },
    component: () => import('@/views/center/assets/index')
  },
  {
    name: 'alipayBind',
    meta: {
      title: '绑定支付宝',
      noAuth: false
    },
    component: () => import('@/views/center/assets/alipayBind')
  },
  {
    name: 'alipayInfo',
    meta: {
      title: '支付宝信息',
      noAuth: false
    },
    component: () => import('@/views/center/assets/alipayInfo')
  },
  {
    name: 'withdrawLog',
    meta: {
      title: '提现流水',
      noAuth: false
    },
    component: () => import('@/views/center/assets/withdrawLog')
  },
  {
    name: 'withdraw',
    meta: {
      title: '提现',
      noAuth: false
    },
    component: () => import('@/views/center/assets/withdraw')
  },
  {
    name: 'moneyLog',
    meta: {
      title: '收支明细',
      noAuth: false
    },
    component: () => import('@/views/center/assets/moneyLog')
  },
  {
    name: 'DjmoneyLog',
    meta: {
      title: '冻结明细',
      noAuth: false
    },
    component: () => import('@/views/center/assets/DjmoneyLog')
  },
  {
    name: 'set',
    meta: {
      title: '设置',
      noAuth: false
    },
    component: () => import('@/views/my/set')
  },
  {
    name: 'storeInfo',
    meta: {
      title: '店铺信息',
      noAuth: false
    },
    component: () => import('@/views/my/storeInfo')
  },
  {
    name: 'location',
    meta: {
      title: '收货地址',
      noAuth: false
    },
    component: () => import('@/views/my/location')
  },
  {
    name: 'updateStoreName',
    meta: {
      title: '修改店铺名称',
      noAuth: false
    },
    component: () => import('@/views/my/updateStoreName')
  },
  {
    name: 'storeLocation',
    meta: {
      title: '店铺地址',
      noAuth: false
    },
    component: () => import('@/views/my/storeLocation')
  },
  {
    name: 'purchase',
    meta: {
      title: '我要批',
      noAuth: false
    },
    component: () => import('@/views/my/purchase')
  },
  {
    name: 'buyGift',
    meta: {
      title: '购买礼券',
      noAuth: false
    },
    component: () => import('@/views/my/buyGift')
  },
  {
    name: 'giftConfig',
    meta: {
      title: '礼券配置',
      noAuth: false
    },
    component: () => import('@/views/my/giftConfig')
  },
  // {
  //   name: 'orderList',
  //   meta: {
  //     title: '进货订单',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/my/orderList')
  // },
  {
    name: 'giftLog',
    meta: {
      title: '礼券明细',
      noAuth: false
    },
    component: () => import('@/views/my/giftLog')
  }
]
