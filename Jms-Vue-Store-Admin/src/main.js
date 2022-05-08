/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-06-11 22:57:23
 * @FilePath    : \src\main.js
 * @Description : TODO
 */
import Vue from 'vue'
import VueTour from 'vue-tour'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'


import '@/assets/styles/index.scss' // global css
import '@/assets/styles/lance.scss' // Lance css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import 'vue-tour/dist/vue-tour.css'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree, treeToList, getUUID, focusValue, formatMoneyValue } from "@/utils/lance";

import Dict, { filterKeyToValue } from "@/utils/enum";

import pinyin from 'pinyin' // JS 汉字转拼音

import _ from 'lodash' // Lodash js until

import elementUtils from 'vue-element-utils' // element utils

import Pagination from "@/components/Pagination";  // 自定义分页组件
import RightToolbar from "@/components/RightToolbar"; //自定义表格工具扩展

// 手机调试工具
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// Vue.use(vConsole)
// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.treeToList = treeToList
Vue.prototype.getUUID = getUUID
Vue.prototype.focusValue = focusValue
Vue.prototype.formatMoneyValue = formatMoneyValue
Vue.prototype.Dict = Dict
Vue.prototype.filterKeyToValue = filterKeyToValue
Vue.prototype.pinyin = pinyin
Vue.prototype._ = _


Vue.prototype.msgSuccess = function (msg, duration = 3000, offset = 20) {
  this.$message({ showClose: true, message: msg, type: "success", duration: duration, offset: offset });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.prototype.chineseToPinyin = function (name) {
  return pinyin(name, {
    style: pinyin.STYLE_FIRST_LETTER
  })
}

Vue.prototype.tableHeight = window.innerHeight && window.innerHeight - 188;

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)
Vue.use(elementUtils)
Vue.use(VueTour)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
