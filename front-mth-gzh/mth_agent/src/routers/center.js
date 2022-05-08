/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 个人中心相关路由
 */
export default [
  // {
  //   name: 'mchRegister',
  //   meta: {
  //     title: '商户进件',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/iboxPay/mchRegister')
  // },
  {
    name: 'mchType',
    meta: {
      title: '选择商户类型',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/mchType')
  },
  {
    name: 'accountType',
    meta: {
      title: '选择账户类型',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/accountType')
  },
  {
    name: 'storeRegister',
    meta: {
      title: '商户注册',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/storeRegister')
  },
  {
    name: 'userType',
    meta: {
      title: '用户类型',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/userType')
  },
  {
    name: 'mchLedgerRegister',
    meta: {
      title: '注册分账账户',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/mchLedgerRegister')
  },
  {
    name: 'mchUploadPic',
    meta: {
      title: '影印件上传',
      noAuth: false
    },
    component: () => import('@/views/iboxPay/mchUploadPic')
  }
]
