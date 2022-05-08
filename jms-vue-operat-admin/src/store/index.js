/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-31 10:29:35
 * @FilePath    : \src\store\index.js
 * @Description : 状态管理
 */
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import goods from './modules/goods'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    goods
  },
  getters
})

export default store
