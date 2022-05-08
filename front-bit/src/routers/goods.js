/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 商品相关路由
 */
export default [
  {
    name: 'goodsList',
    meta: {
      title: '商品列表',
      noAuth: true
    },
    component: () => import('@/views/goods/goodsList')
  },
  {
    name: 'goodsInfo',
    meta: {
      title: '商品详情',
      noAuth: true
    },
    component: () => import('@/views/goods/goodsInfo')
  },
  {
    name: 'goodsUSDTInfo',
    meta: {
      title: '算力租赁详情',
      noAuth: true
    },
    component: () => import('@/views/goods/goodsUSDTInfo')
  },
  {
    name: 'goodsStorageInfo',
    meta: {
      title: '商品详情',
      noAuth: true
    },
    component: () => import('@/views/goods/goodsStorageInfo')
  }
]
