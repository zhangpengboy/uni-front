/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-03-11 15:09:57
 * @FilePath    : \src\main.js
 * @Description : TODO
 */
import Vue from 'vue'

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

import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree, treeToList, getUUID, focusValue, formatMoneyValue } from "@/utils/lance";

import Dict, { filterKeyToValue } from "@/utils/enum";


import _ from 'lodash' // Lodash js until

import elementUtils from 'vue-element-utils' // element utils

import Pagination from "@/components/Pagination";  // 自定义分页组件
import RightToolbar from "@/components/RightToolbar"; //自定义表格工具扩展

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
Vue.prototype._ = _


Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
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

Vue.prototype.tableHeight = window.innerHeight && window.innerHeight - 175;

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)
Vue.use(elementUtils)
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
