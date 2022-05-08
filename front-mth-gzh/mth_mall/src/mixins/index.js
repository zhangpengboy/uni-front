/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2021-01-25 10:53:47
 * @Description  : Vue 混合模式
 */
import store from '../store'
export default {
  data () {
    return {
      // 是否登录
      hasLogin: false
    }
  },
  mounted () {
    this.hasLogin = store.state.hasLogin
  }
}
