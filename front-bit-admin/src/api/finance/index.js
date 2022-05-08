/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-11 15:40:30
 * @Description : 财务管理
 */
import request from '@/utils/request'

/**
 * @description: 获取充值订单列表
 * @param {*} params
 * @return {*}
 */
export function getRechargeOrderList(params) {
  return request({
    url: '/api-admin/recharge/list', params
  })
}

/**
 * @description: 审核充值订单 2->成功 3->失败
 * @param {*} params
 * @return {*}
 */
export function checkInRecharge(params) {
  return request({
    url: '/api-admin/recharge/checkIn', params
  })
}

/**
 * @description: 获取提现订单列表
 * @param {*} params
 * @return {*}
 */
export function getRrawOrderList(params) {
  return request({
    url: '/api-admin/drawCheck/listOrder', params
  })
}

/**
 * @description: 审核提现订单 2->成功 3->失败
 * @param {*} params
 * @return {*}
 */
export function checkInRraw(params) {
  return request({
    url: '/api-admin/drawCheck/check', params
  })
}
/**
 * @description: 获取代理提现订单列表
 * @param {*} params
 * @return {*}
 */
export function getAgentDrawList(params) {
  return request({
    url: '/api-admin/agentDraw/list', params
  })
}

/**
 * @description: 审核代理提现订单 2->成功 3->失败
 * @param {*} params
 * @return {*}
 */
export function auditAgentDraw(params) {
  return request({
    url: '/api-admin/agentDraw/audit', params
  })
}

/**
 * @description: 获取挖矿结算列表
 * @param {*} params
 * @return {*}
 */
export function getDigBitList(params) {
  return request({
    url: '/api-admin/digBit/list', params
  })
}
/**
 * @description: 添加的挖矿结算
 * @param {*} params
 * @return {*}
 */
export function addDigBit(params) {
  return request({
    url: '/api-admin/digBit/dig', params
  })
}
/**
 * @description: 修改挖矿的结算
 * @param {*} params
 * @return {*}
 */
export function editDigBit(params) {
  return request({
    url: '/api-admin/digBit/update', params
  })
}
/**
 * @description: 分发结算挖矿收益 
 * @param {*} params
 * @return {*}
 */
export function shareDigBit(params) {
  return request({
    url: '/api-admin/digBit/share', params
  })
}

/**
 * @description: 获取对公账号列表 
 * @param {*} params
 * @return {*}
 */
export function getCompCardList(params) {
  return request({
    url: '/api-admin/card/compCardList', params
  })
}
/**
 * @description: 添加对公账号 
 * @param {*} params
 * @return {*}
 */
export function addCompCard(params) {
  return request({
    url: '/api-admin/card/compCardAdd', params
  })
}
/**
 * @description: 修改对公账号 
 * @param {*} params
 * @return {*}
 */
export function editCompCard(params) {
  return request({
    url: '/api-admin/card/compCardUpdate', params
  })
}

/**
 * @description: 删除对公账号 
 * @param {*} params
 * @return {*}
 */
export function delCompCard(params) {
  return request({
    url: '/api-admin/card/compCardDel', params
  })
}

/**
 * @description: 提现手续费列表 
 * @param {*} params
 * @return {*}
 */
export function getDrawFeiList(params) {
  return request({
    url: '/api-admin/fei/list', params
  })
}
/**
 * @description: 添加提现手续费配置 
 * @param {*} params
 * @return {*}
 */
export function addDrawFei(params) {
  return request({
    url: '/api-admin/fei/add', params
  })
}
/**
 * @description: 修改提现手续费配置 
 * @param {*} params
 * @return {*}
 */
export function editDrawFei(params) {
  return request({
    url: '/api-admin/fei/update', params
  })
}
/**
 * @description: 币价设置列表 
 * @param {*} params
 * @return {*}
 */
export function getDrawSetList(params) {
  return request({
    url: '/api-admin/drawSet/list', params
  })
}
/**
 * @description: 添加币价设置 
 * @param {*} params
 * @return {*}
 */
export function addDrawSet(params) {
  return request({
    url: '/api-admin/drawSet/add', params
  })
}
/**
 * @description: 修改币价设置 
 * @param {*} params
 * @return {*}
 */
export function editDrawSet(params) {
  return request({
    url: '/api-admin/drawSet/update', params
  })
}