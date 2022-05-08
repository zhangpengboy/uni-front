/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 家乡王牌相关路由
 */
export default [
  // 家乡王牌地址
  {
    path: '/screenapi',
    name: 'screenapi',
    meta: {
      title: '筛选',
      noAuth: false
    },
    component: () => import('@/views/home/homeTown/screenapi')
  }
]
