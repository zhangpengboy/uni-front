/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:50:35
 * @Description  : vuex 状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Router from './router'
import lance from './utils/lance'
import { LOGIN_OUT, USER_WEIXIN_INFO } from './store/mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLogin: !!lance.getJson('token') || false,
    token: lance.getJson('token') || {},
    shop: lance.getJson('active-store') || null,
    userWeixinInfo:
      JSON.parse(window.localStorage.getItem('userWeixinInfo')) || {},
    isApp: false,
    // APP、小程序、公众号 传参参数
    storeQuery: lance.getJson('storeQuery') || {}
  },
  mutations: {
    // 设置是否APP嵌套页面
    isApp (state, payload) {
      state.isApp = payload
    },
    // 首次进入页面参数
    storeQuery (state, payload) {
      state.storeQuery = payload
      lance.setJson('storeQuery', payload)
    },
    login (state, payload) {
      lance.setJson('token', payload.token)
      lance.setJson('active-store', payload.shop)
      lance.setData('phone', payload.token.phone)
      state.hasLogin = true
      state.token = payload.token
      state.shop = payload.shop
    },
    [LOGIN_OUT] (state) {
      lance.clearStorage('token')
      lance.clearStorage('phone')
      lance.clearStorage('active-store')
      lance.clearStorage('storeInfo')
      lance.clearStorage('storeId')
      lance.clearStorage('accountId')
      state.hasLogin = false
      state.shop = null
      state.token = null
    },
    [USER_WEIXIN_INFO] (state, payload) {
      window.localStorage.setItem('userWeixinInfo', JSON.stringify(payload))
      state.userWeixinInfo = payload
    }
  },
  actions: {
    // 登录
    login ({ commit }, data) {
      commit('login', data)
    },
    // 退出登录
    loginOut ({ commit }) {
      commit(LOGIN_OUT)
      Router.push('/')
    },
    clearStoreInfo ({ commit }) {
      commit(LOGIN_OUT)
    },
    setUserWeixinInfo ({ commit }, data) {
      commit(USER_WEIXIN_INFO, data)
    },
    setIsApp ({ commit }, data) {
      commit('isApp', data)
    },
    setStoreQuery ({ commit }, data) {
      commit('storeQuery', data)
    }
  }
})
