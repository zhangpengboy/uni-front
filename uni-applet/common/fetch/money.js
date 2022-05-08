/**
 * @description 资金服务业务请求管理
 * @author LanceYI
 * @time 2021年4月20日17:16:25
 */
import fetch from './request'

// 绑定支付宝
export const addAlipay = (data) => {
	return fetch.post('/api-money/moneyBindAcct/addAlipay', data)
}
//根据账户获取绑定的支付宝账号
export const getAlipayUser = (data) => {
	return fetch.post('/api-money/moneyBindAcct/getAlipayUser', data)
}
//解绑支付宝
export const deleteAlipay = (data) => {
	return fetch.post('/api-money/moneyBindAcct/deleteAlipay', data)
}
//绑卡短信签约
export const addSignNo = (data) => {
	return fetch.post('/api-money/moneyBindAcct/signNo', data)
}
//绑卡短信验证码
export const addSendSms = (data) => {
	return fetch.post('/api-money/moneyBindAcct/sendSms', data)
}
//获取用户资产账户信息，没有则创建
export const getMoneyAccountInfo = (data) => {
	return fetch.post('/api-money/moneyAccount/get', data)
}
//获取用户资产总数
export const getMoneyInfo = (data) => {
	return fetch.post('/api-money/money/moneyTotal', data)
}
//查询提现流水
export const getMoneyDrawList = (data) => {
	return fetch.post('/api-money/moneyDraw/pageListByUser', data)
}
//提现短信签约
export const getMoneyDrawSignNo = (data) => {
	return fetch.post('/api-money/moneyDraw/signNo', data)
}
//提现发送短信验证码
export const getMoneyDrawSendSms = (data) => {
	return fetch.post('/api-money/moneyDraw/sendSms', data)
}
//提现到支付宝
export const getMoneyDrawAlipay = (data) => {
	return fetch.post('/api-money/moneyDraw/moneyZfbEmbodyApplyFor', data)
}
//获取用户资产流水
export const getMoneyList = (data) => {
	return fetch.post('/api-money/money/list', data)
}
// 礼券妈妈详情
export const getincomeGiftMother = (data) => {
	return fetch.post('/api-money/incomeGiftMother/detail', data)
}
export default {
	addAlipay,
	getAlipayUser,
	deleteAlipay,
	addSignNo,
	addSendSms,
	getMoneyAccountInfo,
	getMoneyInfo,
	getMoneyDrawList,
	getMoneyDrawSignNo,
	getMoneyDrawSendSms,
	getMoneyDrawAlipay,
	getMoneyList,
	getincomeGiftMother
}