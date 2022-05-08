/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-14 14:36:05
 * @Description : 商户服务相关接口
 */
import request from '@/utils/request'
// 短信签约
export function getSignNo(data) {
  return request({
    url: '/api-store/account/smsSign', data: data
  })
}
// 获取手机验证码
export function getCodeMsg(data) {
  return request({
    url: '/api-store/account/send', data: data
  })
}
// 获取店铺角色列表
export function getStoreRoleList() {
  return request({
    url: "/api-store/storeRole/list"
  })
}
// 根据店铺角色获取店铺类别列表
export function getStoreRoleCateList(data) {
  return request({
    url: "/api-store/storeRole/storeCateList", data: data
  })
}
// 获取省市区街道地址
export function getStoreAreaList(data) {
  return request({
    url: "/api-store/storeArea/list", data: data
  })
}
// 获取店铺经营类别
export function getStoreCategeAllList() {
  return request({
    url: "/api-store/storeinfo/storeCateList",
  })
}
// 获取店铺分类
export function getStoreGoodsCateList(data) {
  return request({
    url: "/api-store/storeinfo/storeGoodsCate", data: data
  })
}
// 店铺列表
export function getStoreInfoPageList(data) {
  return request({
    url: "/api-store/storeinfo/list", data: data
  })
}
// 创建店铺
export function addStoreInfo(data) {
  return request({
    url: "/api-store/storeinfo/add", data: data
  })
}
// 获取店铺
export function getStoreInfo(data) {
  return request({
    url: "/api-store/storeinfo/detail", data: data
  })
}
// 修改店铺
export function updateStoreInfo(data) {
  return request({
    url: "/api-store/storeinfo/update", data: data
  })
}
// 删除店铺
export function deleteStoreInfo(data) {
  return request({
    url: "/api-store/storeinfo/delete", data: data
  })
}
// 推送代卖商品店铺列表
export function getPushGoodsStoreList(data) {
  return request({
    url: "/api-store/storeinfo/pushStoreList", data: data
  })
}

// 商户注册
export function storeRegister(data) {
  return request({
    url: "/api-store/account/register", data: data
  })
}
// 商户修改密码
export function updateUserPwd(data) {
  return request({
    url: "/api-store/account/updatePwd", data: data
  })
}
// 获取-店铺列表
export function getStoreInfoList(data) {
  return request({
    url: "/api-store/storeAdmin/storeInfoList", data
  })
}
// 查询所有有效店铺列表
export function getStoreInfoAllList(data) {
  return request({
    url: "/api-store/storeinfo/getStoreInfoAllList", data
  })
}