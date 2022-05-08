/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 游戏相关界面
 */
export default [
  {
    name: 'cornGame',
    meta: {
      title: '种玉米',
      noAuth: false
    },
    component: () => import('@/views/game/home')
  }
]
