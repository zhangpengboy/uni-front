/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-06-11 09:34:07
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
// import mixins from './mixins'

import './assets/icons' // icon
import './permission' // permission control

import { parseTime, add, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree, treeToList, getUUID, focusValue, formatMoneyValue } from "@/utils/lance";

import Dict, { filterKeyToValue, stopClick } from "@/utils/enum";

import pinyin from 'pinyin' // JS 汉字转拼音

import _ from 'lodash' // Lodash js until

import elementUtils from 'vue-element-utils' // element utils

import Pagination from "@/components/Pagination";  // 自定义分页组件
import RightToolbar from "@/components/RightToolbar"; //自定义表格工具扩展
// 引入剪切板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.add = add
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
Vue.prototype.stopClick = stopClick
Vue.prototype.pinyin = pinyin
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
    style: pinyin.STYLE_INITIALS
  })
}

Vue.prototype.tableHeight = window.innerHeight && window.innerHeight - 185;

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
// 添加全局mixins
// Vue.mixin(mixins)

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
  // size: 'medium'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
