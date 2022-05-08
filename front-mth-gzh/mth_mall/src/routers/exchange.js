/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 兑换中心相关路由
 */
export default [
  // 兑换页面共享
  {
    path: '/brand',
    name: 'brand',
    meta: {
      title: '兑换中心活动',
      noAuth: true
    },
    component: () => import('@/views/home/exchange/brand')
  }
]
