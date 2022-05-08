/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-24 15:14:28
 * @Description  : 商品管理 相关路由
 */
export default [
  {
    name: 'addGoodsBase',
    meta: {
      title: '添加商城商品',
      noAuth: false
    },
    component: () => import('@/views/goods/addGoods/addGoodsBase')
  },
  {
    name: 'addGoodsInfo',
    meta: {
      title: '添加商城商品',
      noAuth: false
    },
    component: () => import('@/views/goods/addGoods/addGoodsInfo')
  },
  {
    name: 'addGoodsSku',
    meta: {
      title: '添加商城商品',
      noAuth: false
    },
    component: () => import('@/views/goods/addGoods/addGoodsSku')
  },
  {
    name: 'addStreetGoodsIndex',
    meta: {
      title: '添加街市商品',
      noAuth: false
    },
    component: () => import('@/views/goods/addStreetGoods/index')
  },
  {
    name: 'addStoreGoodsBase',
    meta: {
      title: '添加店铺商品',
      noAuth: false
    },
    component: () => import('@/views/goods/addStoreGoods/addStoreGoodsBase')
  },
  // {
  //   name: 'addStoreGoodsInfo',
  //   meta: {
  //     title: '添加店铺商品',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/goods/addStoreGoodsInfo')
  // },
  // {
  //   name: 'addStoreGoodsSku',
  //   meta: {
  //     title: '添加店铺商品',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/goods/addStoreGoodsSku')
  // },
  {
    name: 'goodsDetails',
    meta: {
      title: '商品详情',
      noAuth: false
    },
    component: () => import('@/views/goods/goodsDetails')
  },
  {
    name: 'primaryCategory',
    meta: {
      title: '商品类目',
      noAuth: false
    },
    component: () => import('@/views/goods/primaryCategory')
  },
  {
    name: 'shoppingGoods',
    meta: {
      title: '商品列表',
      noAuth: false
    },
    component: () => import('@/views/goods/shoppingGoods')
  }
  // {
  //   name: 'cs',
  //   meta: {
  //     title: 'ceshi',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/goods/cs')
  // }
]
