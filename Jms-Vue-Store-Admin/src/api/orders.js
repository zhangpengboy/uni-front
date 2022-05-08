/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-14 19:31:08
 * @Description : 订单服务模块
 */

import request from '@/utils/request'

// 参加活动-创建订单
export function createActPackOrder(data) {
  return request({
    url: "/api-order/orderActPck/add", data: data
  })
}
// 积分支付
export function payIntegral(data) {
  return request({
    url: "/api-order/orderActPck/storeBuyPack", data: data
  })
}
// 获取小程序二维码付款
export function getMiniCodePic(data) {
  return request({
    url: "/api-order/orderActPck/wxBarCodeImg", data: data
  })
}
// 商品订单列表
export function getOrdersPageList(data) {
  return request({
    url: "/api-order/orderV2/listByStore", data: data
  })
}
// 获取商品订单详情
export function getOrdersDetail(data) {
  return request({
    url: "/api-order/orderV2/detail", data: data
  })
}
// 订单发货
export function addOrderDelivery(data) {
  return request({
    url: "/api-order/delivery/add", data: data
  })
}
// 商品退款订单列表
export function getOrdersApplyPageList(data) {
  return request({
    url: "/api-order/returnApply/listByStore", data: data
  })
}
// 获取申请退款商品订单详情
export function getReturnApplyDetail(data) {
  return request({
    url: "/api-order/returnApply/detail", data: data
  })
}

// 确认退款商品订单
export function confirmReturnApply(data) {
  return request({
    url: "/api-order/v2/refund/confirm", data: data
  })
}
// 拒绝申请退款商品订单
export function rejectReturnApply(data) {
  return request({
    url: "/api-order/returnApply/reject", data: data
  })
}

// 修改待付款订单金额
export function orderUpdateAmount(data) {
  return request({
    url: "/api-order/orderV2/orderUpdateAmount", data: data
  })
}

// 根据orderNo获取物流信息
export function orderDelivery(data) {
  return request({
    url: "/api-order/delivery/detail", data: data
  })
}
// 根据订单号修改物流信息
export function updateDeliveryNo(data) {
  return request({
    url: "/api-order/delivery/updateDeliveryNo", data: data
  })
}
// 获取所有物流公司
export function getDeliveryList() {
  return request({
    url: "/api-superadmin/appLot/list"
  })
}