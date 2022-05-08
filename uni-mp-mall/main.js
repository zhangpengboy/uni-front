import Vue from 'vue'
import App from './App'
import http from '@/common/fetch/index.js'
import QueueUtils from '@/common/utils/QueueUtils.js'
import StringUtils from '@/common/utils/StringUtils.js'
import Dict from '@/common/utils/dynamicImg.js'
import filters from '@/common/filters/index.js'
import lodash from 'lodash'
import baseShare from '@/common/mixins/baseShare.js'
import mpLogin from '@/common/mixins/mp-login.js'
// 在 app.js 第一行引入SDK
// import QDTracker from '@/common/utils/QDTracker';

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$queue = QueueUtils
Vue.prototype.$stringUtils = StringUtils
Vue.prototype.Dict = Dict
Vue.prototype._ = lodash

App.mpType = 'app'
//状态栏高度
Vue.prototype.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
// SDK 初始化配置
// QDTracker.init({
//   appid: 'wxf0bf5e2c9f9f2f55',
//   kfuin: '2850886966',
// });
// 使用mixins
Vue.mixin(baseShare);
Vue.mixin(mpLogin);
// 添加全局filter
Object.keys(filters).map(v => {
	Vue.filter(v, filters[v])
})
const app = new Vue({
	...App
})
app.$mount()
