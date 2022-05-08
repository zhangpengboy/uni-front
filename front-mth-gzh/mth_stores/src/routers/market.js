/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 营销管理 相关路由
 */
export default [
  {
    name: 'registration',
    meta: {
      title: '活动中心',
      noAuth: false
    },
    component: () => import('@/views/market/registration')
  },
  {
    name: 'toSignUp',
    meta: {
      title: '活动报名',
      noAuth: false
    },
    component: () => import('@/views/market/toSignUp')
  },
  {
    name: 'management',
    meta: {
      title: '商品管理',
      noAuth: false
    },
    component: () => import('@/views/market/management')
  },
  {
    name: 'saleDetail',
    meta: {
      title: '在售中商品详情',
      noAuth: false
    },
    component: () => import('@/views/market/saleDetail')
  },
  {
    name: 'addGoods',
    meta: {
      title: '添加商品',
      noAuth: false
    },
    component: () => import('@/views/market/addGoods')
  }
]
