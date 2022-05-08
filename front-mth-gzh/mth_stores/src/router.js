import Vue from 'vue'
import Router from 'vue-router'
import AppRouter from './routers'
import store from './store'

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
    name: 'login',
    meta: { title: '商户登录', noAuth: true },
    component: () => import('@/views/login')
  },
  {
    name: 'goods',
    meta: {
      title: '商品管理',
      noAuth: false
    },
    component: () => import('@/views/goods')
  },
  {
    name: 'order',
    meta: {
      title: '订单管理',
      noAuth: false
    },
    component: () => import('@/views/order')
  },
  {
    name: 'market',
    meta: {
      title: '营销管理',
      noAuth: false
    },
    component: () => import('@/views/market')
  },
  {
    name: 'my',
    meta: {
      title: '个人',
      noAuth: false
    },
    component: () => import('@/views/my')
  },
  {
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
  base: '/store',
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
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 移动端打开保存状态
  if (to.query.isApp) {
    store.dispatch('setIsApp', !!+to.query.isApp)
  }
  // inWay 店铺入驻方式 default 普通店铺 digitalShelves 数字货架
  // type 店铺类型 create 创建店铺
  // storeAccountId create创建店铺需要
  if (to.query.inWay || to.query.type) {
    to.meta.noAuth = true
    store.dispatch('setStoreQuery', to.query)
  }
  if (to.meta.noAuth) {
    next()
  } else {
    if (!store.state.hasLogin) {
      next('/')
      return false
    }
    // if (to.path === '/author' && !_.isEmpty(store.state.userWeixinInfo)) {
    //   // 用户使用后退返回到授权页，则默认回到首页
    //   next('/')
    //   return false
    // }
    // if (!_.isEmpty(store.state.userWeixinInfo) && !store.state.hasLogin) {
    //   // 判断是否登录
    //   next('/login')
    //   return false
    // }
    // if (_.isEmpty(store.state.userWeixinInfo) && to.path !== '/author') {
    //   // 第一次进入项目
    //   window.sessionStorage.setItem('beforeLoginUrl', to.fullPath) // 保存用户进入的url
    //   next('/author')
    //   return false
    // }
    next()
  }
})

export default router
