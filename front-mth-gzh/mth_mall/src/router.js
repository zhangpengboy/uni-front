/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 17:13:12
 * @Description  :
 */
import Vue from 'vue'
import Router from 'vue-router'
import AppRouter from './routers'
import store from './store'
import lance from './utils/lance'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)

const routes = [
  {
    path: '/',
    meta: {
      title: '拾惠街市',
      noAuth: true
    },
    component: () => import('@/views/home'),
    redirect: '/exchange',
    children: [
      {
        path: '/exchange',
        name: 'exchange',
        meta: {
          title: '兑换中心',
          noAuth: true
        },
        component: () => import('@/views/home/exchange')
      },
      {
        path: '/hometown',
        name: 'hometown',
        meta: {
          title: '家乡王牌',
          noAuth: true
        },
        component: () => import('@/views/home/homeTown')
      },
      {
        path: '/shopping',
        name: 'shopping',
        meta: {
          title: '品牌特卖',
          noAuth: true
        },
        component: () => import('@/views/home/shopping')
      },
      {
        path: '/my',
        name: 'my',
        meta: {
          title: '我的',
          noAuth: false
        },
        component: () => import('@/views/home/my')
      }
    ]
  },
  {
    path: '/bindPhone',
    name: 'bindPhone',
    meta: {
      title: '绑定手机号',
      noAuth: true
    },
    component: () => import('@/views/bindPhone')
  },
  {
    path: '/author',
    name: 'author',
    meta: { title: '微信授权登陆中...', noAuth: true },
    component: () => import('@/views/author')
  },
  ...AppRouter,
  {
    path: '*',
    name: 'NotFount',
    meta: {
      title: '404 Not Fount',
      noAuth: true
    },
    component: () => import('@/views/404')
  }
]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '')
})

const router = new Router({
  mode: 'history',
  base: '/',
  routes,
  scrollBehavior (to, from, savedPosition) {
    // 从第二页返回首页时savedPosition为undefined
    if (savedPosition || typeof savedPosition === 'undefined') {
      // 只处理设置了路由元信息的组件
      from.meta.isKeepAlive =
        typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
      to.meta.isKeepAlive =
        typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
      if (savedPosition) {
        return savedPosition
      }
    } else {
      from.meta.isKeepAlive =
        typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
      to.meta.isKeepAlive =
        typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
    }
  }
})
router.beforeEach((to, from, next) => {
  // 路由名称切换
  if (to.path === '/brand' || to.path === '/recommend' || to.path === '/homeList' || to.path === '/homeEnd') {
    to.meta.title = lance.getData('titleName')
  }
  // 登录拦截验证
  if (to.meta.noAuth) {
    next()
  } else {
    // 用户使用后退返回到授权页，则默认回到首页
    if (to.path === '/author' && !_.isEmpty(store.state.userWeixinInfo) && store.state.hasLogin) {
      next('/')
      return false
    }
    // 第一次进入项目
    if ((!store.state.hasLogin || _.isEmpty(store.state.userWeixinInfo)) && to.path !== '/author') {
      window.sessionStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
      next('/author')
      return false
    }

    // if (to.path === '/author' && !_.isEmpty(store.state.userWeixinInfo)) {
    //   // 用户使用后退返回到授权页，则默认回到首页
    //   next('/')
    //   return false
    // }
    // if (!_.isEmpty(store.state.userWeixinInfo) && !store.state.hasLogin) {
    //   // 判断是否登录
    //   next('/author')
    //   return false
    // }
    // if (_.isEmpty(store.state.userWeixinInfo) && to.path !== '/author') {
    //   // 第一次进入项目
    //   window.sessionStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
    //   next('/author')
    //   return false
    // }
    // // (已登录后)地址栏直接跳转 确认订单页、支付页面、支付成功页面、礼券妈妈、礼券妈妈入驻页面时拦截到 'my' 页面
    // if (
    //   (!from.name && to.name === 'giftMotherEnter') ||
    //   (!from.name && to.name === 'giftMother') ||
    //   (!from.name && to.name === 'submitOrder') ||
    //   (!from.name && to.name === 'aiipay') ||
    //   (!from.name && to.name === 'accomplish')
    // ) {
    //   return next('/my')
    // }
    next()
  }
})

export default router
