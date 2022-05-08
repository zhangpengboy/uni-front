/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-27 14:55:28
 * @FilePath    : \src\api\menu.js
 * @Description : 菜单相关的接口
 */
import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/system/menu/getTreeMenu',
    method: 'get'
  })
}