/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-07-14 22:07:02
 * @Description : 店铺入驻、修改等  相关路由
 */
export default [
  {
    name: 'register',
    meta: {
      title: '商户注册',
      noAuth: true
    },
    component: () => import('@/views/login/register')
  },
  {
    name: 'edit',
    meta: {
      title: '重置登录密码',
      noAuth: true
    },
    component: () => import('@/views/login/editPwd')
  },
  {
    name: 'inApplication',
    meta: {
      title: '店铺入驻',
      noAuth: false
    },
    component: () => import('@/views/merchant/inApplication')
  },
  // {
  //   name: 'storeSelect',
  //   meta: {
  //     title: '选择店铺',
  //     noAuth: false
  //   },
  //   component: () => import('@/views/merchant/storeSelect')
  // },
  {
    name: 'waitReview',
    meta: {
      title: '待审核店铺',
      noAuth: false
    },
    component: () => import('@/views/merchant/waitReview')
  },
  {
    name: 'refuse',
    meta: {
      title: '审核不通过',
      noAuth: false
    },
    component: () => import('@/views/merchant/refuse')
  },
  {
    name: 'close',
    meta: {
      title: '已关闭店铺',
      noAuth: false
    },
    component: () => import('@/views/merchant/close')
  },
  {
    name: 'storeSelect',
    meta: {
      title: '店铺列表',
      noAuth: false
    },
    component: () => import('@/views/merchant/storeSelect')
  }
]
