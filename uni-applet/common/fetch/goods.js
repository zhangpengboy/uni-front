/**
 * @description 商品服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'

// 获取通用活动商品列表
export const getActGoodsList = (data) => {
	return fetch.post('/api-goods/goodsAct/pageListMall', data);
}
// 获取小程序首页商品列表
export const getMpGoodsList = (data) => {
	return fetch.post('/api-goods/goods/getMpGoodsList', data);
}
// 根据上级actCode获取下级列表
export const getActChildList = (data) => {
	return fetch.post('/api-superadmin/v2/appAct/childList', data);
}
// mall分页获取活动商品V2
export const getActGoodsListV2 = (data) => {
	return fetch.post('/api-goods/goodsAct/pageListMall/v2', data);
}
// 获取家乡王牌列表
export const getHometownGoodsList = (data) => {
	return fetch.post('/api-goods/goodsActCommon/getHometownList', data);
}
// // 获取首页的banner图
// export const getActBannerList = (data) => {
// 	return fetch.post('/api-goods/goodsActAdvertise/list', data);
// }
// 获取首页的banner图
export const getActBannerList = (data) => {
	return fetch.post('/api-goods/goodsActAdvertise/mid_list', data);
}
// 获取商品基础信息
export const getGoodsBaseList = (data) => {
	return fetch.post('/api-goods/goods/pageList', data);
}
// 获取商品基础信息
export const getGoodsBase = (data) => {
	return fetch.post('/api-goods/goods/detail', data);
}
// 获取商品详情
export const getGoodsDetail = (data) => {
	return fetch.post('/api-goods/goods/detailInfo', data);
}
// 获取商品sku
export const getGoodsSkuList = (data) => {
	return fetch.post('/api-goods/goods/skuList', data);
}
// 获取获取活动
export const getActListByType = (data) => {
	return fetch.post('/api-goods/goodsActCommon/getActListByType', data);
}
// 获取获取活动
export const getHomeActList = (data) => {
	return fetch.post('/api-goods/goodsActCommon/getHomeActList', data);
}
// 根据店铺查询推荐商品
export const getGoodsRecommend = (data) => {
	return fetch.post('/api-goods/goodsRecommend/getGoodsByStore', data);
}
// 根据店铺查询新品
export const getGoodsNews = (data) => {
	return fetch.post('/api-goods/goodsNews/getGoodsByStore', data);
}
// 根据店铺查询活动
export const getGoodsActivity = (data) => {
	return fetch.post('/api-goods/goods/getGoodsActivityInverted', data);
}
// 根据店铺查询宝贝
export const getGoodsBabys = (data) => {
	return fetch.post('/api-goods/goods/getGoodsInverted', data);
}
// 根据商品名称模糊查询列表
export const nameGoodsList = (data) => {
	return fetch.post('/api-goods/goods/nameGoodsList', data);
}
// 根据商品名称模糊查询店铺内商品列表
export const nameStoreGoodsList = (data) => {
	return fetch.post('/api-goods/goods/nameStoreGoodsList', data);
}
// 查询家乡王牌商品
export const getHomeGoodsList = (data) => {
	return fetch.post('/api-goods/goods/getHomeGoodsList', data);
}

// 获取精品商品全部商品列表
export const getShopAllGoodsPageList = (data) => {
	return fetch.post('/api-goods/goods/getShopAllGoodsPageList', data);
}

// 根据UUID查询数字货架商品、代卖店铺、供应商信息    数字货架
export const cloudStoreGetGoodsByUuid = (data) => {
	return fetch.post('/api-goods/cloudStore/getGoodsByUuid', data);
}
// 根据UUID查询礼券妈妈商品、代卖店铺、供应商信息    礼券妈妈
export const giftMotherGetGoodsByUuid = (data) => {
	return fetch.post('/api-goods/giftMother/getGoodsByUuid', data);
}
// APP、小程序、公众号分页查看云店推送商品列表
export const pushGoodsList = (data) => {
	return fetch.post('/api-goods/cloudStore/pageList', data);
}
// 查询商品分润配置
export const getGoodsIncomeConfig = (data) => {
	return fetch.post('/api-goods/goods/getGoodsIncomeConfig', data);
}

// 分页查看礼券妈妈商品列表（根据条件查询，具体看入参实体）
export const getPushGoodsList = (data) => {
	return fetch.post('/api-goods/giftMother/pushGoodsList', data);
}

// 店铺商品列表
export const storeGoodsList = (data) => {
	return fetch.post('/api-goods/storeGoods/storeGoodsList', data);
}
// 默认全部导出  import api from '@/common/fetch/'
export default {
	getActBannerList,
	getActGoodsList,
	getActGoodsListV2,
	getHometownGoodsList,
	getGoodsBase,
	getGoodsDetail,
	getGoodsSkuList,
	getActListByType,
	getHomeActList,
	getGoodsRecommend,
	getGoodsNews,
	getGoodsActivity,
	getGoodsBabys,
	nameGoodsList,
	nameStoreGoodsList,
	getHomeGoodsList,
	getShopAllGoodsPageList,
	cloudStoreGetGoodsByUuid,
	giftMotherGetGoodsByUuid,
	pushGoodsList,
	getGoodsIncomeConfig,
	getPushGoodsList,
	storeGoodsList,
	getGoodsBaseList,
	getMpGoodsList,
	getActChildList
}
