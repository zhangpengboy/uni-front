/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-24 22:25:52
 * @Description  : 加载权限和路由文件
 */
import { constantRoutes } from '@/router'
import { asyncRoutes } from '@/router/asyncRouter'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'


const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, { roles }) {
      return new Promise(resolve => {
        asyncRoutes.push({ path: '*', redirect: '/404', hidden: true })
        // ! ceshi 隐藏资金管理，其他都显示
        // console.log('roles', roles);
        // console.log('asyncRoutes', asyncRoutes);
        if (_.indexOf(roles, 'ceshi') >= 0) {
          _.map(asyncRoutes, item => {
            item.hidden = false
            // 资金管理
            if (item.name === 'Money') {
              item.hidden = true
            }
          })
        }
        // ! caiwu 财务账号其他隐藏 显示店铺列表、资金管理、礼券赠送
        if (_.indexOf(roles, 'caiwu') >= 0) {
          _.map(asyncRoutes, item => {
            item.hidden = true
            // 资金管理
            // if (item.name === 'Money') {
            //   item.hidden = false
            // }
            // 商户管理
            if (item.name === 'Stores') {
              item.hidden = false;
              _.map(item.children, v => {
                v.hidden = true;
                if (v.name === 'StoresInfo' || v.name === 'StoresIntegral') {
                  v.hidden = false;
                }
              })
            }
          })
        }


        // ! 小玲 店铺列表、礼券赠送相关功能 
        if (_.indexOf(roles, 'xiaoling') >= 0) {
          _.map(asyncRoutes, item => {
            item.hidden = true
            // 商户管理
            if (item.name === 'Stores') {
              item.hidden = false;
              _.map(item.children, v => {
                v.hidden = true;
                if (v.name === 'StoresInfo') {
                  v.hidden = false;
                }
              })
            }
            // 报表统计
            if (item.name === 'Statistical') {
              item.hidden = false;
            }
          })
        }
        // ! 龙叶团队权限
        if (_.indexOf(roles, 'zengsg') >= 0 || _.indexOf(roles, 'jiayin') >= 0) {
          _.map(asyncRoutes, item => {
            item.hidden = true
            if (item.name == "Goods" ) {
              item.hidden = false;
            }
            if (item.name == "Orders" ) {
              item.hidden = false;
            }
            if (item.name == "Stores" ) {
              item.hidden = false;
            }
            // 营销管理
            if (item.name === 'Market') {
              item.hidden = false;
              _.map(item.children, v => {
                v.hidden = true;
                if (v.name == "MarketBanner" ||
                  v.name == "MarketGoods" ||
                  v.name == "MarketBusinessCooperation" ||
                  v.name == 'CloudStore' ||
                  v.name == 'MarketPack') {
                  v.hidden = false
                }
              })
            }
          })
        }
        commit('SET_ROUTES', asyncRoutes)
        resolve(asyncRoutes)
        // 向后端请求路由数据
        // getRouters().then(res => {
        //   const accessedRoutes = filterAsyncRouter(res.data)
        //   accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        //   commit('SET_ROUTES', accessedRoutes)
        //   resolve(accessedRoutes)
        // })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
