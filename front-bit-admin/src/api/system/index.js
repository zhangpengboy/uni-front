/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-02 16:33:01
 * @Description  : 系统管理 - 配置相关的接口
 */

import request from '@/utils/request'

/**
 * =========================================================
 *                          挖矿类型配置
 * =========================================================
 */
// 获取列表
export function getBitTypeList(params) {
  return request({
    url: "/api-admin/bitType/list", params
  })
}
export function addBitType(params) {
  return request({
    url: "/api-admin/bitType/add", params
  })
}
export function editBitType(params) {
  return request({
    url: "/api-admin/bitType/update", params
  })
}

/**
 * =========================================================
 *                          电费配置
 * =========================================================
 */
export function getBitPowerList(params) {
  return request({
    url: "/api-admin/bitPower/list", params
  })
}
export function addBitPower(params) {
  return request({
    url: "/api-admin/bitPower/add", params
  })
}
export function editBitPower(params) {
  return request({
    url: "/api-admin/bitPower/update", params
  })
}
/**
 * =========================================================
 *                          算力表配置
 * =========================================================
 */
export function getBitUsdtList(params) {
  return request({
    url: "/api-admin/bitUsdt/list", params
  })
}
export function addBitUsdt(params) {
  return request({
    url: "/api-admin/bitUsdt/add", params
  })
}
export function editBitUsdt(params) {
  return request({
    url: "/api-admin/bitUsdt/update", params
  })
}
/**
 * =========================================================
 *                          代理和奖励配置
 * =========================================================
 */
// 获取代理角色列表
export function getBitRewardList(params) {
  return request({
    url: "/api-admin/bitReward/roleList", params
  })
}
// 添加或修改代理角色信息
export function addAndUpdateRole(params) {
  return request({
    url: "/api-admin/bitReward/addAndUpdateRole", params
  })
}
// 获取代理奖励列表
export function getRoleRewardList(params) {
  return request({
    url: "/api-admin/bitReward/roleRewardList", params
  })
}
// 添加或修改代理奖励信息
export function addAndUpdateRoleReward(params) {
  return request({
    url: "/api-admin/bitReward/addAndUpdateRoleReward", params
  })
}
// 获取团长奖励列表
export function getRoleTeamRewardList(params) {
  return request({
    url: "/api-admin/bitReward/roleTeamRewardList", params
  })
}
// 添加或修改团长奖励信息
export function addAndUpdateTeamReward(params) {
  return request({
    url: "/api-admin/bitReward/addAndUpdateTeamReward", params
  })
}

