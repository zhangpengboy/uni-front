/**
 * @description 订单服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'

// 创建充值礼券订单
export const createRechargeOrder = (data) => {
	return fetch.post('/api-order/rechargeOrder/add', data)
}
// 获取充值礼券码订单列表
export const getRechargeOrderList = (data) => {
	return fetch.post('/api-order/rechargeOrder/pageList', data)
}
// 统计订单数量
export const getOrderCount= (data) => {
	return fetch.post('/api-order/orderV2/orderCount', data)
}
// 创建礼券码开通订单
export const createOpenQrCodeOrder = (data) => {
	return fetch.post('/api-order/orderV2/orderBuyVip', data)
}
// 创建线下扫码付款订单
export const createOfflineOrder = (data) => {
	return fetch.post('/api-order/orderV2/orderOffline', data)
}
// 创建商品订单
export const createGoodsOrder = (data) => {
	return fetch.post('/api-order/orderV2/add', data);
}
// 获取商品订单详情
export const getGoodsOrderDetail = (data) => {
	return fetch.post('/api-order/orderV2/detail', data);
}
// 获取用户商品订单列表
export const getGoodsOrderList = (data) => {
	return fetch.post('/api-order/orderV2/listByUser', data);
}
// 取消订单
export const concelGoodsOrder = (data) => {
	return fetch.post('/api-order/orderV2/cancel', data);
}
// 确认收货
export const confirmGoodsOrder = (data) => {
	return fetch.post('/api-order/orderV2/confirm', data);
}
// 申请退款
export const refundGoodsOrder = (data) => {
	return fetch.post('/api-order/returnApply/add', data);
}
// 获取退款申请信息
export const getRefundOrderDetail = (data) => {
	return fetch.post('/api-order/returnApply/detail', data);
}
// 通用充值订单
export const getdepositOrder = (data) => {
	return fetch.post('/api-order/depositOrder/add', data);
}
// 创建充值订单V2
export const getdepositOrder_v2 = (data) => {
	return fetch.post('/api-order/depositOrder/add_v2', data);
}
// 创建订单
export const streetOrderAdd = (data) => {
	return fetch.post('/api-order/streetOrder/add', data);
}


// 根据用户查询所有订单
export const pageListByUser = (data) => {
	return fetch.post('/api-order/streetOrder/pageListByUser', data);
}
// 取消订单
export const streetOrderCancel = (data) => {
	return fetch.post('/api-order/streetOrder/cancel', data);
}
// 确认订单
export const streetOrderConfirm = (data) => {
	return fetch.post('/api-order/streetOrder/confirm', data);
}
// 根据订单号查询订单
export const getStreetOrderByOrderNo = (data) => {
	return fetch.post('/api-order/streetOrder/getStreetOrderByOrderNo', data);
}
// 订单核销
export const orderVerification = (data) => {
	return fetch.post('/api-order/streetOrder/orderVerification', data);
}
export default {
	createRechargeOrder,
	createOpenQrCodeOrder,
	getRechargeOrderList,
	createOfflineOrder,
	createGoodsOrder,
	getGoodsOrderDetail,
	getGoodsOrderList,
	concelGoodsOrder,
	confirmGoodsOrder,
	refundGoodsOrder,
	getRefundOrderDetail,
	getdepositOrder,
	getdepositOrder_v2,
	streetOrderAdd,
	pageListByUser,
	streetOrderCancel,
	getStreetOrderByOrderNo,
	orderVerification,
	getOrderCount
}
