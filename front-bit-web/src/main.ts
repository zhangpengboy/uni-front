/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-21 14:05:11
 * @Description : TODO
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'default', zIndex: 3000 });

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
