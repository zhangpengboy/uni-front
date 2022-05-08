/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-29 19:45:24
 * @FilePath    : \src\directive\permission\index.js
 * @Description : TODO
 */
import hasRole from './hasRole'
import hasPermi from './hasPermi'



const install = function (Vue) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
  // ? 数字格式化指令
  Vue.directive('inputNumber', {
    bind: function (el, binding, vnode) {
      const element = el.getElementsByTagName('input')[0]
      const len = binding.arg  // 初始化设置 
      element.value = Number(element.value).toFixed(len)  // 失焦时候格式化
      element.addEventListener('blur', function () {
        if (isNaN(element.value)) {
          vnode.data.model.callback(0)
        } else {
          vnode.data.model.callback(Number(element.value).toFixed(len))
        }
      })
    }
  })
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install
