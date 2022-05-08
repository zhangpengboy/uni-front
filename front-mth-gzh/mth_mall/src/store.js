/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:50:35
 * @Description  : vuex 状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Router from './router'
import lance from './utils/lance'
import { LOGIN_OUT, USER_WEIXIN_INFO, USER_INFO, LOT_CENTER } from './store/mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasLogin: !!lance.getJson('token') || false,
    token: lance.getJson('token') || {},
    userInfo: lance.getJson('userInfo') || {},
    userWeixinInfo:
      JSON.parse(window.localStorage.getItem('userWeixinInfo')) || {},
    // 定位
    lotCenter: JSON.parse(window.localStorage.getItem('lotCenter')) || { 'lng': '9999.0', 'lat': '9999.0', 'city': '未知' }
  },
  mutations: {
    login (state, payload) {
      lance.setJson('token', payload.token)
      state.hasLogin = true
      state.token = payload.token
    },
    [LOGIN_OUT] (state) {
      lance.setJson('token', null)
      lance.setJson('userInfo', null)
      lance.setJson('userInviteCode', null)
      lance.setJson('userWeixinInfo', null)
      state.hasLogin = false
      state.userInfo = {}
      state.userWeixinInfo = {}
      state.token = null
    },
    [USER_WEIXIN_INFO] (state, payload) {
      window.localStorage.setItem('userWeixinInfo', JSON.stringify(payload))
      state.userWeixinInfo = payload
    },
    [USER_INFO] (state, payload) {
      lance.setJson('userInfo', payload)
      state.userInfo = payload
    },
    [LOT_CENTER] (state, payload) {
      window.localStorage.setItem('lotCenter', JSON.stringify(payload))
      state.lotCenter = payload
    }
  },
  actions: {
    // 登录
    login ({ commit }, data) {
      commit('login', data)
    },
    loginOut ({ commit }) {
      commit(LOGIN_OUT)
      Router.push('/author')
      // Router.push('login')
    },
    clearStoreInfo ({ commit }) {
      commit(LOGIN_OUT)
    },
    setUserWeixinInfo ({ commit }, data) {
      commit(USER_WEIXIN_INFO, data)
    },
    setUserInfo ({ commit }, data) {
      commit(USER_INFO, data)
    },
    setLotCenter ({ commit }, data) {
      commit(LOT_CENTER, data)
    }
  }
})
