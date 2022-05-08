/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-24 17:30:50
 * @Description  : 登录、注册接口地址管理 
 */

import request from '@/utils/request'

/**
 * @description: 注册
 * @param {*} data
 * @return {*}
 */
export function register(data) {
  return request({
    url: "/api-store/account/regist",
    method: 'POST',
    data: data
  })
}

/**
 * @description: 登录
 * @param {*} data
 * @return {*}
 */
export function login(data) {
  return request({
    url: "/api-store/account/login",
    method: 'POST',
    data: data
  })
}

/**
 * @description: 获取当前手机号下所有店铺
 * @param {*} data
 * @return {*}
 */
 export function storeList(data) {
  return request({
    url: "/api-store/storeinfo/getStoreInfoByPhone",
    method: 'POST',
    data: data
  })
}

/**
 * @description: 获取用户信息 
 * @param {*} data
 * @return {*}
 */
export function getInfo(data) {
  return request({
    url: "/api-store/account/detail",
    method: 'POST',
    data: data
  })
}

// 查询所有业务列表
export function appBusinessDictList(data) {
  return request({
      url: '/api-superadmin/appBusinessDict/list',
      data
  })
}