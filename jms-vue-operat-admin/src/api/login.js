/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-24 17:30:50
 * @Description  : 登录、获取用户详情接口地址管理 
 */

import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: "/api-admin/login", data: data
  })
}
// 获取用户信息
export function getInfo(data) {
  return request({
    url: "/api-admin/detail",
    data: data
  })
}
// 退出登陆
export function logout(data) {
  return request({
    url: "/api-admin/loginOut",
    data: data
  })
}