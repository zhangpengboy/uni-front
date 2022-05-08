/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 17:13:12
 * @Description  :
 */
import Vue from 'vue'
import Router from 'vue-router'
import AppRouter from './routers'
import store from './store'
// import baseUtils from './utils/baseUtils'
import lance from './utils/lance'
import { Toast } from 'vant'

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
Vue.use(Toast)

const routes = [
  {
    path: '/',
    name: 'center',
    meta: { title: '个人中心', noAuth: true },
    component: () => import('@/views/tabbar/center')
  },
  {
    path: '/agentApply',
    name: 'agentApply',
    meta: { title: '代理商申请', noAuth: true },
    component: () => import('@/views/tabbar/agentApply')
  },
  // {
  //   name: 'register',
  //   meta: { title: '代理商注册', noAuth: true },
  //   component: () => import('@/views/login/register')
  // },
  {
    name: 'region',
    meta: { title: '区域选择', noAuth: false },
    component: () => import('@/views/tabbar/region')
  },
  {
    name: 'popedomList',
    meta: { title: '代理列表', noAuth: false },
    component: () => import('@/views/tabbar/popedomList')
  },
  {
    name: 'popedomDetails',
    meta: { title: '代理详情', noAuth: false },
    component: () => import('@/views/tabbar/popedomDetails')
  },
  {
    name: 'earningsDetails',
    meta: { title: '收益', noAuth: false },
    component: () => import('@/views/tabbar/earningsDetails')
  },
  {
    path: '/myTeam',
    name: 'myTeam',
    meta: { title: '我的邀请', noAuth: false },
    component: () => import('@/views/team/myTeam')
  },
  {
    path: '/myRaword',
    name: 'myRaword',
    meta: { title: '我的收益', noAuth: false },
    component: () => import('@/views/team/myRaword')
  },
  {
    path: '/myRawordDetail',
    name: 'myRawordDetail',
    meta: { title: '收益详情', noAuth: false },
    component: () => import('@/views/team/myRawordDetail')
  },
  {
    name: 'subgroup',
    meta: { title: '子团队', noAuth: false },
    component: () => import('@/views/team/subgroup')
  },
  {
    name: 'luckyWheel',
    meta: { title: '幸运大转盘', noAuth: false },
    component: () => import('@/views/lucky/luckyWheel')
  },

  // {
  //   name: 'author',
  //   meta: { title: '微信授权登陆中...', noAuth: true },
  //   component: () => import('@/views/author')
  // },
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
  base: '/webview',
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
  // 移动端打开保存状态
  if (to.query.isApp) {
    store.dispatch('setIsApp', !!+to.query.isApp)
  }
  // H5端
  if (to.query.isH) {
    store.dispatch('setIsH5', !!+to.query.isH)
  }
  if (to.query.userId) {
    lance.setData('userId', to.query.userId)
  }
  if (to.query.storeId) {
    lance.setData('storeId', to.query.storeId)
  }
  next()
})

export default router
