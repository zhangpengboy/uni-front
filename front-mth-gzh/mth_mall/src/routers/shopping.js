/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 精品商城相关路由
 */
export default [
  // 精品金刚区
  {
    path: '/homeList',
    name: 'homeList',
    meta: {
      title: '',
      noAuth: true
    },
    component: () => import('@/views/home/shopping/homeList')
  }
]
