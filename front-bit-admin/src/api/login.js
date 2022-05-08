/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-24 17:30:50
 * @Description  : 登录、获取用户详情接口地址管理 
 */

import request from '@/utils/request'

/**
 * @description: 登录
 * @param {*} params
 * @return {*}
 */
export function login(params) {
  return request({
    url: "/api-admin/login",
    params: params
  })
}

/**
 * @description: 获取用户信息 
 * @param {*} params
 * @return {*}
 */
export function getInfo(params) {
  return request({
    url: "/api-admin/detail",
    params: params
  })
}

/**
 * @description: 退出登陆 
 * @param {*} params
 * @return {*}
 */
export function logout(params) {
  return request({
    url: "/api-admin/logout",
    params: params
  })
}