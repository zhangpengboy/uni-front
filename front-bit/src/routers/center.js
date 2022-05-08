/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 个人中心相关路由
 */
export default [
  {
    name: 'settings',
    meta: {
      title: '账户设置',
      noAuth: false
    },
    component: () => import('@/views/center/settings')
  },
  {
    name: 'addressEdit',
    meta: {
      title: '地址修改',
      noAuth: false
    },
    component: () => import('@/views/center/address/edit')
  },
  {
    name: 'addressList',
    meta: {
      title: '地址列表',
      noAuth: false
    },
    component: () => import('@/views/center/address/list')
  },
  {
    name: 'wallet',
    meta: {
      title: '我的钱包',
      noAuth: false
    },
    component: () => import('@/views/center/money/wallet')
  },
  {
    name: 'walletList',
    meta: {
      title: '钱包记录',
      noAuth: false
    },
    component: () => import('@/views/center/money/walletList')
  },
  {
    name: 'moneyInfo',
    meta: {
      title: '资产详情',
      noAuth: false
    },
    component: () => import('@/views/center/money/moneyInfo')
  },
  {
    name: 'moneyList',
    meta: {
      title: '交易记录',
      noAuth: false
    },
    component: () => import('@/views/center/money/moneyList')
  },
  {
    name: 'recharge',
    meta: {
      title: '转入',
      noAuth: false
    },
    component: () => import('@/views/center/money/recharge')
  },
  {
    name: 'rechargeList',
    meta: {
      title: '转入记录',
      noAuth: false
    },
    component: () => import('@/views/center/money/rechargeList')
  },
  {
    name: 'rechargeOrder',
    meta: {
      title: '汇款订单',
      noAuth: false
    },
    component: () => import('@/views/center/money/rechargeOrder')
  },
  {
    name: 'rechargeStatus',
    meta: {
      title: '转入状态',
      noAuth: false
    },
    component: () => import('@/views/center/money/rechargeStatus')
  },
  {
    name: 'withdraw',
    meta: {
      title: '转出',
      noAuth: false
    },
    component: () => import('@/views/center/money/withdraw')
  },
  {
    name: 'withdrawList',
    meta: {
      title: '转出记录',
      noAuth: false
    },
    component: () => import('@/views/center/money/withdrawList')
  },
  {
    name: 'withdrawStatus',
    meta: {
      title: '转出状态',
      noAuth: false
    },
    component: () => import('@/views/center/money/withdrawStatus')
  },
  {
    name: 'cardList',
    meta: {
      title: '收/付款设置',
      noAuth: false
    },
    component: () => import('@/views/center/card/list')
  },
  {
    name: 'resetPayPasswords',
    meta: {
      title: '重置支付密码',
      noAuth: false
    },
    component: () => import('@/views/center/card/resetPayPasswords')
  },
  {
    name: 'bindBank',
    meta: {
      title: '绑定银行卡',
      noAuth: false
    },
    component: () => import('@/views/center/card/bindBank')
  },
  {
    name: 'bindWallet',
    meta: {
      title: '绑定钱包',
      noAuth: false
    },
    component: () => import('@/views/center/card/bindWallet')
  },
  {
    name: 'bitOut',
    meta: {
      title: '转出',
      noAuth: false
    },
    component: () => import('@/views/center/money/bitOut')
  }
]
