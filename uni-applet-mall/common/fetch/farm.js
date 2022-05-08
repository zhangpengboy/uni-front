/**
 * @description 购物车服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'


// 添加好友
export const addInviteFriend = (data) => {
	return fetch.post('/api-corn/cornFriendInvite/inviteFriend', data);
}
// 获取添加好友申请列表
export const getInviteList = (data) => {
	return fetch.post('/api-corn/cornFriendInvite/inviteList', data);
}
// 修改好友申请状态
export const updateInviteStatus = (data) => {
	return fetch.post('/api-corn/cornFriendInvite/updateStatus', data);
}
// 获取好友列表
export const getMyFriendList = (data) => {
	return fetch.post('/api-corn/cornFriend/getMyFriend', data);
}
// 获取领取配置
export const getCornConfig = (data) => {
	return fetch.post('/api-corn/cornConfig/getLatestConfig', data);
}
// 获取我的能量值
export const getCornEnergy = (data) => {
	return fetch.post('/api-corn/cornEnergy/getEnergy', data);
}
// 获取玉米树
export const getCornPlant = (data) => {
	return fetch.post('/api-corn/cornPlant/getCorn', data);
}
// 种植玉米树
export const createPlantCorn = (data) => {
	return fetch.post('/api-corn/cornPlant/plantCorn', data);
}
// 玉米树浇能量
export const cornWaterEnergy = (data) => {
	return fetch.post('/api-corn/cornPlant/addEnergy', data);
}
// 玉米树浇能量
export const cornSign = (data) => {
	return fetch.post('/api-corn/cornPlant/cornSign', data);
}
// 采摘玉米
export const pickCorn = (data) => {
	return fetch.post('/api-corn/cornPlant/pickCorn', data);
}



export default {
	addInviteFriend,
	getInviteList,
	updateInviteStatus,
	getMyFriendList,
	getCornConfig,
	getCornEnergy,
	getCornPlant,
	createPlantCorn,
	cornWaterEnergy,
	cornSign,
	pickCorn
}
