/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 10:57:08
 * @Description  : APP 嵌套页面路由
 */

import Protocol from './protocol'
import Goods from './goods'
import Orders from './orders'
import Center from './center'
import Pay from './pay'

export default [
  ...Protocol,
  ...Goods,
  ...Orders,
  ...Center,
  ...Pay
]
