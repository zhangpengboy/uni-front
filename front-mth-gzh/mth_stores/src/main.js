/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 16:06:15
 * @Description  : VUE2.0 主类
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './mixins'
import filters from './filters'
// 移动端适配
import 'amfe-flexible'
// 配置axios
import api from './api/index.js'
// 导入自定义包
import utils from './utils/index'
// 引入map
// import BaiduMap from 'vue-baidu-map'
// 配置路由导航
import Navigation from 'vue-navigation'
// 引入echarts
// import ECharts from 'vue-echarts'
// 引入Vant组件
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入剪切板
import VueClipboard from 'vue-clipboard2'
// 引入二维码插件
import qrcode from 'vue-qrcode-directive'
// 手机调试工具
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// Vue.use(vConsole)

Vue.use(Vant)
Vue.use(VueClipboard)
Vue.use(qrcode)
Vue.use(Navigation, { router, store })
Vue.use(utils)

// if (process.env.NODE_ENV === 'development') {
//   Vue.use(BaiduMap, {
//     /* 需要注册百度地图开发者来获取你的ak */
//     ak: 'x1W6Q9BbXxuypLbKoYmAWZp1KOVdX3ey'
//   })
// }

Vue.config.productionTip = false
Vue.prototype.$http = api

// 添加全局filter
Object.keys(filters).map(v => {
  Vue.filter(v, filters[v])
})
// 添加全局mixins
Vue.mixin(mixins)
// 全局注册组件
// Vue.component('v-chart', ECharts)
new Vue({
  router,
  store,
  // mixins: [mixins],
  render: h => h(App)
}).$mount('#app')
