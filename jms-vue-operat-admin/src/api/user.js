/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-14 19:31:08
 * @Description : 用户管理模块
 */

import request from '@/utils/request'

/** 
 * ========================================================
 *                       用户列表
 * ========================================================
 **/
// 创建初始系统账号
export function initUserFeign(data) {
  return request({
    url: "/api-user/userFeign/init", data
  })
}
// 获取用户奖励提成系数
export function getUserIncomeCv(data) {
  return request({
    url: "/api-relation/relTree/incomeCv/get", data
  })
}
// 修改用户奖励提成系数
export function updateUserPageList(data) {
  return request({
    url: "/api-relation/relTree/incomeCv/update", data
  })
}
// 全部的用户信息
export function getUserPageList(data) {
  return request({
    url: "/api-user/user/getUserPageList", data
  })
}
// 修改用户角色类型
export function updateUserRole(data) {
  return request({
    url: "/api-user/userRole/update", data
  })
}
// 修改用户角色类型
export function userUpdateUserRole(data) {
  return request({
    url: "/api-user/user/userRole/update", data
  })
}
// 绑定下级用户关系
export function bindRelationUser(data) {
  return request({
    url: "/api-relation/relation/bindRelationUser", data
  })
}
// 绑定用户上下级用户关系
export function bindUserRelation(data) {
  return request({
    url: "/api-relation/relTree/bindUserRelation", data
  })
}
// 解绑下级用户关系
export function unBind(data) {
  return request({
    url: "/api-relation/relation/unBind", data
  })
}

// 修改业务员分润配置
export function updateSalesmanIncomeConfig(data) {
  return request({
    url: "/api-relation/relation/updateSalesmanIncomeConfig", data
  })
}

// 矫正伞下团队数量
export function correctData(data) {
  return request({
    url: "/api-relation/relTree/correctData", data
  })
}
// 运营后台-开通团长
export function openGroup(data) {
  return request({
    url: "/api-relation/relTree/openGroup", data
  })
}

// 矫正伞下服务区域
export function correctAgentArea(data) {
  return request({
    url: "/api-relation/relTree/correctAgentArea", data
  })
}


// 首页访客记录
export function getBackstageDataExhibition(data) {
  return request({
    url: "api-admin/getBackstageDataExhibition", data
  })
}

// 获取365福袋店东、代理列表
export function relTreeUserList(data) {
  return request({
    url: "/api-relation/relTree/userList", data
  })
}
// 修改用户等级
export function userLevelUpdate(data) {
  return request({
    url: "/api-user/userLevel/update", data
  })
}
// 查询店东奖励发放列表
export function settlementDes(data) {
  return request({
    url: "/api-money/incomeStore/pageListByUser", data
  })
}
// 查询店东奖励发放列表
export function settlementDesAgent(data) {
  return request({
    url: "/api-money/incomeAgent/pageListByUser", data
  })
}
// 系统进行评判等级
export function userLevelReview(data) {
  return request({
    url: "/api-user/userLevel/review", data
  })
}

// 开通用户总包商代理
export function openUserAgent(data) {
  return request({
    url: "/api-user/user/addAgent", data
  })
}