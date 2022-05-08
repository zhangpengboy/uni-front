/**
 * @description 业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'
import goods from './goods'
import orders from './orders'
import pays from './pays'
import stores from './stores'
import users from './users'
import money from './money.js'


// 单独导出(测试接口) import {test} from '@/common/fetch/'  如何使用
export const test = (data) => {
	/* fetch.config.baseUrl = "fetch://localhost:8080/api/"
	//设置请求前拦截器
	fetch.interceptor.request = (config) => {
		config.header = {
			"token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		}
	} */
	//设置请求结束后拦截器
	fetch.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
	return fetch.request({
		baseUrl: 'https://unidemo.dcloud.net.cn/',
		url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
		data,
	})
}


/**
 * ====================================================================================================
 * tt-mall 相关接口
 * Lance yi <latticeyi@gmail.com>
 * 2020年11月20日15:11:11
 * ====================================================================================================
 */
// 授权登陆
export const oauthLogin = (data) => {
	// return fetch.post('/api-portal/mallUser/wxLogin', data)
	return fetch.post('/api-user/user/miniLogin', data)
}
// 获取用户详情
export const getUserDetail = () => {
	// return fetch.post('/api-portal/mallUser/detail')
	return fetch.post('/api-user/user/userinfo')
}
// 获取用户资金
export const getUserMoney = () => {
	return fetch.post('/api-money/mallMoney/get')
}
// 获取用户积分
export const getUserGral = () => {
	return fetch.post('/api-integral/gralV2/get')
}
// 根据用户获取积分明细
export const getIntegralListById = (data) => {
	return fetch.post('/api-integral/gralV2/getIntegralListById',data)
}
// 根据用户获取积分冻结明细
export const getFrozenIntegralListById = (data) => {
	return fetch.post('/api-integral/gralV2/getFrozenIntegralListById',data)
}
// 获取积分锁仓、释放列表
export const getlockList = (data) => {
	return fetch.post('/api-integral/gralV2/lockList',data)
}
// 获取微信小程序码
export const getMiniCodePic = (data) => {
	return fetch.post('/api-relation/relTree/wxBarCodeImg', data)
}
// 用户是否完善用户信息
export const getUserInfoIsComplete = (data) => {
	// return fetch.post('/api-portal/mallUser/userInfoIsComplete', data)
	return fetch.post('/api-user/user/userInfoIsComplete', data)
}
// 更新微信用户信息
export const userInfoUpdate = (data) => {
	// return fetch.post('/api-portal/mallUser/userInfoUpdate', data)
	return fetch.post('/api-user/user/userInfoUpdate', data)
}
// 获取分享对应的小程序码
export const getShareQrcode = (data) => {
	return fetch.post('/api-upload/oss/shareQrcode', data)
}


/**
 * ====================================================================================================
 * Sub Goods 商品分包页面相关接口
 * Lance yi <latticeyi@gmail.com>
 * 2020年11月20日15:11:11
 * ====================================================================================================
 */




// 默认全部导出  import api from '@/common/fetch/'
export default {
	test,
	// tt-goods
	...goods,
	// tt-order
	...orders,
	// tt-pay
	...pays,
	// tt-store
	...stores,
	// tt-mall
	...users,
	// tt-money
	...money,
	oauthLogin,
	getUserDetail,
	getUserMoney,
	getUserGral,
	getMiniCodePic,
	getUserInfoIsComplete,
	userInfoUpdate,
	getIntegralListById,
	getFrozenIntegralListById,
	getlockList,
	getShareQrcode
}
