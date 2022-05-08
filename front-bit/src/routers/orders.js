/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 订单相关路由
 */
export default [
  {
    name: 'confirmation',
    meta: {
      title: '确认订单',
      noAuth: false
    },
    component: () => import('@/views/orders/confirmation')
  },
  {
    name: 'orderList',
    meta: {
      title: '订单列表',
      noAuth: false
    },
    component: () => import('@/views/orders/orderList')
  },
  {
    name: 'orderInfo',
    meta: {
      title: '订单详情',
      noAuth: false
    },
    component: () => import('@/views/orders/orderInfo')
  },
  {
    name: 'refundList',
    meta: {
      title: '退货订单',
      noAuth: false
    },
    component: () => import('@/views/orders/refundList')
  }
]
