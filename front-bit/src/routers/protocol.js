/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 11:23:40
 * @Description  : 协议路由
 */

export default [
  // ? 协议
  {
    name: 'serviceProtocol',
    meta: {
      title: '服务协议',
      noAuth: true
    },
    component: () => import('@/views/protocol/service')
  },
  {
    name: 'privacyProtocol',
    meta: {
      title: '隐私协议',
      noAuth: true
    },
    component: () => import('@/views/protocol/privacy')
  },
  {
    name: 'vipProtocol',
    meta: {
      title: '购买VIP协议',
      noAuth: true
    },
    component: () => import('@/views/protocol/vip')
  }
]
