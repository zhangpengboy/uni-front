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
    isApp: false,
    isH5: false,
    mchType: lance.getData('mchType') || null,
    accountType: lance.getData('accountType') || null,
    userType: lance.getData('userType') || null,
    hasLogin: !!lance.getJson('token') || false,
    user: lance.getJson('user') || null,
    userWeixinInfo: JSON.parse(window.localStorage.getItem('userWeixinInfo')) || {}
  },
  mutations: {
    // 设置是否APP嵌套页面
    isApp (state, payload) {
      state.isApp = payload
    },
    isH5 (state, payload) {
      state.isH5 = payload
    },
    mchType (state, payload) {
      state.mchType = payload
    },
    accountType (state, payload) {
      state.accountType = payload
    },
    userType (state, payload) {
      state.userType = payload
    },
    login (state, payload) {
      lance.setJson('user', payload)
      state.hasLogin = true
      state.user = payload
    },
    [LOGIN_OUT] (state) {
      lance.clearStorage('token')
      state.hasLogin = false
      state.user = null
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
    loginOut ({ commit }) {
      commit(LOGIN_OUT)
      Router.push('login')
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
    setIsH5 ({ commit }, data) {
      commit('isH5', data)
    },
    mchType ({ commit }, data) {
      commit('mchType', data)
    },
    accountType ({ commit }, data) {
      commit('accountType', data)
    },
    userType ({ commit }, data) {
      commit('userType', data)
    }
  }
})
