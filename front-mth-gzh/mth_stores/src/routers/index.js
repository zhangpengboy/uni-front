/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 10:57:08
 * @Description  : APP 嵌套页面路由
 */

import Center from './center'
import merchant from './merchant'
import goods from './goods'
import market from './market'
import order from './order'

export default [
  ...Center,
  ...merchant,
  ...goods,
  ...market,
  ...order
]
