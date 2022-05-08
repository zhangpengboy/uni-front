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
    user: lance.getJson('user') || null,
    userWeixinInfo: JSON.parse(window.localStorage.getItem('userWeixinInfo')) || {}
  },
  mutations: {
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
    }
  }
})
