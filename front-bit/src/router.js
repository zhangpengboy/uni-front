/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 17:13:12
 * @Description  :
 */
import Vue from 'vue'
import Router from 'vue-router'
import BTC from './views/tabbar/btc'
import ETH from './views/tabbar/eth'
// import XCH from './views/tabbar/xch'
import ALLIANCE from './views/tabbar/alliance'
import USDT from './views/tabbar/usdt'
import STORAGE from './views/tabbar/storage'
import Center from './views/tabbar/center'
import AppRouter from './routers'
import store from './store'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)

const routes = [
  {
    name: 'btc',
    meta: { title: 'BTC挖矿', noAuth: true },
    component: BTC
  },
  {
    name: 'eth',
    meta: { title: 'ETH挖矿', noAuth: true },
    component: ETH
  },
  // {
  //   name: 'xch',
  //   meta: { title: 'XCH专区', noAuth: true },
  //   component: XCH
  // },
  {
    path: '/',
    name: 'alliance',
    meta: { title: '联合挖矿', noAuth: true },
    component: ALLIANCE
  },
  {
    name: 'usdt',
    meta: { title: '算力专区', noAuth: true },
    component: USDT
  },
  {
    name: 'storage',
    meta: { title: '存储挖矿', noAuth: true },
    component: STORAGE
  },
  {
    name: 'center',
    meta: { title: '我的', noAuth: true },
    component: Center
  },
  {
    name: 'login',
    meta: { title: '登录', noAuth: true },
    component: () => import('@/views/login')
  },
  {
    name: 'register',
    meta: { title: '注册', noAuth: true },
    component: () => import('@/views/login/register')
  },
  {
    name: 'password',
    meta: { title: '忘记密码', noAuth: true },
    component: () => import('@/views/login/password')
  },
  // {
  //   name: 'demo',
  //   meta: { title: 'demo', noAuth: true },
  //   component: () => import('@/views/demo')
  // },
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
  base: '/',
  routes,
  scrollBehavior (to, from, savedPosition) {
    // 从第二页返回首页时savedPosition为undefined
    if (savedPosition || typeof savedPosition === 'undefined') {
      // 只处理设置了路由元信息的组件
      from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
      to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
      if (savedPosition) {
        return savedPosition
      }
    } else {
      from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
      to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.noAuth) {
    next()
  } else {
    if (!store.state.hasLogin) {
      next('/login')
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
