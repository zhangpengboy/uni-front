/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 订单管理 相关路由
 */
export default [
  {
    name: 'orderDetails',
    meta: {
      title: '订单详情',
      noAuth: false
    },
    component: () => import('@/views/order/orderDetails')
  },
  {
    name: 'mallOrderList',
    meta: {
      title: '商城订单',
      noAuth: false
    },
    component: () => import('@/views/order/mallOrderList')
  },
  {
    name: 'storeOrderList',
    meta: {
      title: '店铺订单',
      noAuth: false
    },
    component: () => import('@/views/order/storeOrderList')
  },
  {
    name: 'storeOrderDetails',
    meta: {
      title: '订单详情',
      noAuth: false
    },
    component: () => import('@/views/order/storeOrderDetails')
  }
]
