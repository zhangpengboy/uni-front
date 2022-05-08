/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 订单相关路由
 */
export default [
  {
    name: 'payment',
    meta: {
      title: '支付',
      noAuth: false
    },
    component: () => import('@/views/pay/payment')
  },
  {
    name: 'payResult',
    meta: {
      title: '支付结果',
      noAuth: false
    },
    component: () => import('@/views/pay/payResult')
  }
]
