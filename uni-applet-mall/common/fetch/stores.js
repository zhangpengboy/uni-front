/**
 * @description 商户服务业务请求管理
 * @author LanceYI
 * @time2021年4月12日12:36:31
 * @email 342003386@qq.com
 */
import fetch from './request'

// 商家登录
export const storeLogin = (data) => {
	return fetch.post('/api-store/account/login', data)
}
// 获取店铺二维码
export const getStoreQRCode = (data) => {
	return fetch.post('/api-store/store/integrals/createQRCode', data)
}
// 获取小程序店铺商品列表（new）
export const getStoreGoodsList = (data) => {
	return fetch.post('/api-goods/goods/getStoreGoodsList', data);
}
// 根据店铺角色获取开通条件
export const getIntegralPack = (data) => {
	return fetch.post('/api-store/store/integrals/getPack', data)
}
// 获取店铺套餐列表
export const getIntegralListPack = (data) => {
	return fetch.post('/api-store/store/integrals/listPack', data)
}
// 根据店铺角色获取充值积分比列
export const getIntegralRate = (data) => {
	return fetch.post('/api-store/store/integrals/getRate', data)
}
// 根据店铺获取充值礼券比例
export const getIntegralBuyRate = (data) => {
	return fetch.post('/api-store/store/integrals/buyRate', data)
}
// 获取店铺赠送积分配置
export const getIntegralConfig = (data) => {
	return fetch.post('/api-store/store/integrals/getConfig', data)
}
// 修改店铺赠送积分配置
export const editIntegralConfig = (data) => {
	return fetch.post('/api-store/store/integrals/editConfig', data)
}
// (礼券购买)计算付款积分
export const giveIntegralTotal = (data) => {
	return fetch.post('/api-store/storeinfo/giveIntegralTotal', data)
}
// 店铺交易统计
export const transactionTotal = (data) => {
	return fetch.post('/api-store/storeinfo/transactionTotal', data)
}
// 礼券详情
export const getCouponDetails = (data) => {
	return fetch.post('/api-store/storeinfo/coupon/details', data)
}
// 获取店铺信息
export const getStoreInfoByStoreId = (data) => {
	return fetch.post('/api-store/storeinfo/get', data)
}
// 获取店铺信息并判断用户是否关注
export const getStoreInfoAndFavor = (data) => {
	return fetch.post('/api-store/storeinfo/getStoreInfoAndFavor', data)
}
// 根据手机号获取店铺列表
export const getStoreInfoByPhone = (data) => {
	return fetch.post('/api-store/storeinfo/getStoreInfoByPhone', data)
}
// 根据区域ID获取下级分类
export const getstoreAreaList = (data) => {
	return fetch.post('/api-store/storeArea/list', data)
}
// 根据code反查地址
export const getcheckstoreArea = (data) => {
	return fetch.post('/api-store/storeArea/get', data)
}
// 修改商户登录密码
export const updatePassword = (data) => {
	return fetch.post('/api-store/account/updatePassword', data)
}
// 修改商户登录密码
export const signNoByType = (data) => {
	return fetch.post('/api-sms/sms/signNoByType', data)
}

// 获取礼券妈妈开通支付金额
export const storeGiftMother = (data) => {
	return fetch.post('/api-store/storeGiftMother/payMoney', data)
}
// 根据店铺角色获取店铺类别列表
export const storeCateList = (data) => {
	return fetch.post('/api-store/storeRole/storeCateList', data)
}
// 礼券妈妈C店注册
export const createGiftMother = (data) => {
	return fetch.post('/api-store/storeinfo/createGiftMother', data)
}
// 根据手机号获取礼券妈妈开通信息
export const storeGiftMothergetByPhone = (data) => {
	return fetch.post('/api-store/storeGiftMother/getByPhone', data)
}
// 根据手机号是否开通礼券妈妈
export const storeGiftMotherhasOpen = (data) => {
	return fetch.post('/api-store/storeGiftMother/hasOpen', data)
}
// 当前用户是否为代理 true -> 代理，false -> 不是代理
export const dlStatistics = (data) => {
	return fetch.post('/api-store/dlStatistics/dlIsUserDl', data)
}
// 代理状态
export const dlStatus = (data) => {
	return fetch.post('/api-store/dlStatistics/dlStatus', data)
}
// 获取店铺详情
export const storeinfoDetail = (data) => {
	return fetch.post('/api-store/storeinfo/detail', data)
}

// 获取充值VIP会员金额配置
export const vipRecharge = (data) => {
	return fetch.post('/api-admin/config/recharge/vip', data)
}
export default {
	storeLogin,
	getStoreQRCode,
	getIntegralPack,
	getIntegralRate,
	getIntegralBuyRate,
	getIntegralConfig,
	editIntegralConfig,
	giveIntegralTotal,
	transactionTotal,
	getCouponDetails,
	getStoreInfoByStoreId,
	getStoreInfoAndFavor,
	getStoreInfoByPhone,
	getstoreAreaList,
	getcheckstoreArea,
	updatePassword,
	signNoByType,
	storeGiftMother,
	storeCateList,
	createGiftMother,
	storeGiftMothergetByPhone,
	storeGiftMotherhasOpen,
	dlStatistics,
	dlStatus,
	storeinfoDetail,
	vipRecharge,
	getIntegralListPack,
	getStoreGoodsList
}
