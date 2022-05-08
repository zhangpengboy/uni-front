/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-24 22:25:52
 * @Description  : 用户模块-状态管理
 */
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    user: {},
    store: JSON.parse(window.localStorage.getItem("SET_STORE")) || null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USER: (state, smsUser) => {
      state.user = smsUser;
    },
    SET_STORE: (state, store) => {
      state.store = store;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          setToken('Jms-Store-Token',res.data.token)
          commit('SET_TOKEN', res.data.token)
          // window.localStorage.removeItem("SET_STORE")
          // commit("SET_STORE", null)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data.user
          const avatar = user.avatar ? process.env.VUE_APP_BASE_API + user.avatar : require("@/assets/logo/logo.png");
          commit('SET_ROLES', res.data.roles)
          //   commit('SET_ROLES', ['admin'])
          //   commit('SET_ROLES', ['ROLE_DEFAULT'])
          commit('SET_PERMISSIONS', res.permissionList || ["*:*:*"])
          commit('SET_NAME', user.phone)
          commit('SET_AVATAR', avatar)
          commit('SET_USER', user)
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          window.localStorage.removeItem("SET_STORE")
          commit("SET_STORE", null)
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        window.localStorage.removeItem("SET_STORE")
        commit("SET_STORE", null)
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 当前登录店铺
    SetStore({ commit }, store) {
      window.localStorage.setItem("SET_STORE", JSON.stringify(store));
      commit("SET_STORE", store)
    }
  }
}

export default user
