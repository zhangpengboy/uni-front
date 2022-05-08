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
import BaiduMap from 'vue-baidu-map'
// 配置路由导航
import Navigation from 'vue-navigation'
// 引入echarts
// import ECharts from 'vue-echarts'
// 引入剪切板
import VueClipboard from 'vue-clipboard2'
// 引入二维码插件
import qrcode from 'vue-qrcode-directive'
// 引入Vant
import {
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Button,
  Cell,
  CellGroup,
  Icon,
  Image,
  Row,
  Col,
  Popup,
  DatetimePicker,
  Field,
  Picker,
  Uploader,
  ActionSheet,
  Dialog,
  DropdownMenu,
  DropdownItem,
  Loading,
  Notify,
  Overlay,
  Toast,
  Sticky,
  Cascader,
  NavBar,
  Pagination,
  Area,
  SubmitBar,
  Empty,
  Tabs,
  Tab,
  PullRefresh,
  List,
  Grid,
  GridItem,
  Search,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  Sidebar,
  SidebarItem,
  Skeleton,
  Checkbox,
  CheckboxGroup,
  Card,
  Stepper,
  SwipeCell,
  ContactCard,
  AddressEdit,
  AddressList,
  CountDown,
  RadioGroup,
  Radio,
  Form,
  NumberKeyboard,
  Badge,
  Divider,
  Lazyload,
  Tag,
  Switch,
  ImagePreview,
  Calendar,
  ShareSheet
} from 'vant'

// 手机调试工具
import VConsole from 'vconsole'

Vue.use(qrcode)
Vue.use(ShareSheet)
Vue.use(Navigation, { router, store })
Vue.use(utils)
Vue.use(Calendar)
Vue.use(Cascader)
Vue.use(Badge)
Vue.use(NumberKeyboard)
Vue.use(Form)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Field)
Vue.use(Picker)
Vue.use(Uploader)
Vue.use(ActionSheet)
Vue.use(Dialog)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Loading)
Vue.use(Notify)
Vue.use(Overlay)
Vue.use(Toast)
Vue.use(Sticky)
Vue.use(NavBar)
Vue.use(Pagination)
Vue.use(Area)
Vue.use(SubmitBar)
Vue.use(Empty)
Vue.use(Tabs)
Vue.use(Tab)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(CountDown)
Vue.use(AddressList)
Vue.use(AddressEdit)
Vue.use(ContactCard)
Vue.use(SwipeCell)
Vue.use(Stepper)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Skeleton)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(Sku)
Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(Search)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(VueClipboard)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(ImagePreview)
Vue.use(Lazyload, {
  lazyComponent: true
})
if (process.env.NODE_ENV === 'development') {
  const vConsole = new VConsole()
  console.log(vConsole.version)
}
if (process.env.NODE_ENV === 'development') {
  Vue.use(BaiduMap, { ak: 'leuSffRhfn9ysUifXtnNAqzkYOsBG5by' })
}
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
