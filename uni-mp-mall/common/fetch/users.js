/**
 * @description 用户服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'
// 获取用户信息
export const getUsermallUser = (data) => {
	return fetch.post('/api-user/user/get', data);
}
// 判断用户是否绑定手机号
export const isBindPhone = (data) => {
	return fetch.post('/api-user/user/isBindPhone', data);
}
// 授权登陆后绑定手机号码（通用方法）
export const bindingPhone = (data) => {
	return fetch.post('/api-user/user/bindPhone', data);
}
// 获取商品是否关注
export const getFaverGoodsIsKeep = (data) => {
	return fetch.post('/api-user/userFavor/getGoods', data);
}
// 添加商品收藏
export const addFaverGoods = (data) => {
	return fetch.post('/api-user/userFavor/addGoods', data);
}
// 删除商品收藏
export const delFaverGoods = (data) => {
	return fetch.post('/api-user/userFavor/delGoods', data);
}
// 获取商品收藏
export const getFaverGoodsList = (data) => {
	return fetch.post('/api-user/userFavor/listGoods', data);
}
// 添加商品到购物车
export const addGoodsCart = (data) => {
	return fetch.post('/api-user/goodsCart/add', data);
}
// 删除购物车商品
export const delGoodsCart = (data) => {
	return fetch.post('/api-user/goodsCart/delete', data);
}
// 获取购物车列表
export const getGoodsCartList = (data) => {
	return fetch.post('/api-user/goodsCart/pageList', data);
}

// 添加地址
export const addAddress = (data) => {
	return fetch.post('/api-user/address/add', data)
}
// 删除地址
export const deleteAddress = (data) => {
	return fetch.post('/api-user/address/delete', data)
}
// 修改地址
export const updateAddress = (data) => {
	return fetch.post('/api-user/address/update', data)
}
// 获取地址列表
export const getAddressList = () => {
	return fetch.post('/api-user/address/list')
}
// 获取地址详情
export const getAddressInfo = (data) => {
	return fetch.post('/api-user/address/detail', data)
}
// 关注当前店铺
export const addStore = (data) => {
	return fetch.post('/api-user/userFavor/addStore', data)
}
// 取消关注商铺
export const delStore = (data) => {
	return fetch.post('/api-user/userFavor/delStore', data)
}
// 获取关注店铺列表以及店铺被关注数量
export const pageListStore = (data) => {
	return fetch.post('/api-user/userFavor/pageListStore', data)
}

// 用户密码祥光接口

//用户忘记密码短信签约
export const forgetPwdSmsSign = (data) => {
	// return fetch.post('/api-portal/mallUser/forgetPwdSmsSign', data)
	return fetch.post('/api-user/user/forgetPwdSmsSign', data)
}
//用户注册短信发送
export const SmsSend = (data) => {
	return fetch.post('/api-sms/sms/send', data)
}
//修改登录密码
export const editforgetPwd = (data) => {
	// return fetch.post('/api-portal/mallUser/forgetPwd', data)
	return fetch.post('/api-user/user/forgetPwd', data)
}

// 数字货架相关接口
// 获取业务员数数字货架是否需要支付状态（true: 需要支付 false: 免费）
export const getDigitalShelves = (data) => {
	return fetch.post('/api-user/user/getDigitalShelves', data)
}
// 获取数字货架支付金额
export const getMoney = (data) => {
	return fetch.post('/api-user/user/getMoney', data)
}
// 修改数字货架支付状态
export const updateDigitalShelves = (data) => {
	return fetch.post('/api-user/user/updateDigitalShelves', data)
}


// 分润配置相关接口
// 获取合伙人分润配置
export const getPartnerIncomeConfig = (data) => {
	return fetch.post('/api-relation/relation/getPartnerIncomeConfig', data)
}
// 修改合伙人分润配置
export const updatePartnerIncomeConfig = (data) => {
	return fetch.post('/api-relation/relation/updatePartnerIncomeConfig', data)
}
// 合伙人、业务经理
// 获取合伙人、业务经理列表
export const getpageListByUser = (data) => {
	return fetch.post('/api-relation/relation/pageListByUser', data)
}
// 根据手机号绑定上下级关系
export const bindRelationByPhone = (data) => {
	return fetch.post('/api-relation/relation/bindRelationByPhone', data)
}


// 开通365礼券
export const openGiftBag = (data) => {
	return fetch.post('/api-user/userPay/notify', data)
}
// 查看使用和未使用的礼包卷
export const getGiftUse = (data) => {
	return fetch.post('/api-user/gift/getGiftUse', data)
}
// 获取礼包总配置列表
export const getGiftConfig = (data) => {
	return fetch.post('/api-user/gift/giftConfig/pageList', data)
}
// 返回判断当前时间用户是否签到
export const isUserSign = (data) => {
	return fetch.post('/api-user/gift/isUserSign', data)
}
// 用户级别判断
export const getTopUser = (data) => {
	return fetch.post('/api-relation/relation/getTopUser', data)
}
// 用户礼包签到
export const userGiftSign = (data) => {
	return fetch.post('/api-user/gift/userGiftSign', data)
}
// 返回当前时间所属的礼包卷
export const userCurrentGift = (data) => {
	return fetch.post('/api-user/gift/gift', data)
}
// 返回是否是第一个次签到
export const IsFirstTimeSign = (data) => {
	return fetch.post('/api-user/gift/IsFirstTimeSign', data)
}
// 返回漏签的天数
export const getOmitCount = (data) => {
	return fetch.post('/api-user/gift/getOmitCount', data)
}
// 用户礼包签到
export const repairSign = (data) => {
	return fetch.post('/api-user/gift/repairSign', data)
}
// 返回是否开通365礼包
export const getIsBuyGift = (data) => {
	return fetch.post('/api-user/gift/getIsBuyGift', data)
}

// 查询注册时是否需要邀请码
export const getInviteConfig = (data) => {
	return fetch.post('/api-user/user/getInviteConfig',data)
}
// 根据手机号获取邀请码
export const getInviteCode = (data) => {
	return fetch.post('/api-user/user/getInviteCode', data)
}
// 绑定邀请关系
export const bindRelation = (data) => {
	return fetch.post('/api-relation/relTree/bindRelation', data)
}
export default {
	getUsermallUser,
	bindingPhone,
	getFaverGoodsIsKeep,
	addFaverGoods,
	delFaverGoods,
	getFaverGoodsList,
	addGoodsCart,
	delGoodsCart,
	getGoodsCartList,
	addAddress,
	updateAddress,
	deleteAddress,
	getAddressList,
	getAddressInfo,
	addStore,
	delStore,
	pageListStore,
	forgetPwdSmsSign,
	SmsSend,
	editforgetPwd,
	getDigitalShelves,
	getMoney,
	updateDigitalShelves,
	openGiftBag,
	getGiftUse,
	getGiftConfig,
	isUserSign,
	getTopUser,
	userGiftSign,
	userCurrentGift,
	getPartnerIncomeConfig,
	updatePartnerIncomeConfig,
	IsFirstTimeSign,
	getOmitCount,
	getpageListByUser,
	repairSign,
	getIsBuyGift,
	bindRelationByPhone,
	isBindPhone,
	getInviteConfig,
	getInviteCode,
	bindRelation
}
