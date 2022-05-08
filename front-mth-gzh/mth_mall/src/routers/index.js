/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 10:57:08
 * @Description  : APP 嵌套页面路由
 */

import Center from './center'
import my from './my'
import exchange from './exchange'
import shopping from './shopping'
import hometown from './hometown'

export default [
  ...Center,
  ...my,
  ...exchange,
  ...shopping,
  ...hometown
]
