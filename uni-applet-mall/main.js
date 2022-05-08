import Vue from 'vue'
import App from './App'
import http from '@/common/fetch/index.js'
import QueueUtils from '@/common/utils/QueueUtils.js'
import StringUtils from '@/common/utils/StringUtils.js'
import Dict from '@/common/utils/dicts.js'
import filters from '@/common/filters/index.js'
import baseShare from '@/common/mixins/baseShare.js'
import mpLogin from '@/common/mixins/mp-login.js'
/* 自定义顶部导航 */
import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)
/* lodash.js */
import lodash from 'lodash';

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$queue = QueueUtils
Vue.prototype.$stringUtils = StringUtils
Vue.prototype.Dict = Dict
Vue.prototype._ = lodash

App.mpType = 'app'

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
