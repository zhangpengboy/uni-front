/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-26 11:05:50
 * @Description  : 商品管理 - 请求接口
 */

import request from '@/utils/request'

/**
 * =========================================================
 * 
 *                        商品管理
 * 
 * =========================================================
 */
// 商品列表
export function getGoodsPageList(data) {
  return request({
    url: "/api-goods/goods/storeGoodsList", data: data
  })
}
// 获取商品基础信息
export function getGoodsBase(data) {
  return request({
    url: "/api-goods/goods/detail", data: data
  })
}
// 获取商品详情信息
export function getGoodsInfo(data) {
  return request({
    url: "/api-goods/goods/detailInfo", data: data
  })
}
// 获取商品SKU列表
export function getGoodsSkuList(data) {
  return request({
    url: "/api-goods/goods/skuList", data: data
  })
}
// 创建商品
export function addGoods(data) {
  return request({
    url: "/api-goods/goods/add", data: data
  })
}
// 修改商品
export function updateGoods(data) {
  return request({
    url: "/api-goods/goods/update", data: data
  })
}
// 删除商品
export function deleteGoods(data) {
  return request({
    url: "/api-goods/goods/delete", data: data
  })
}
// 创建商品详情
export function addGoodsDetail(data) {
  return request({
    url: "/api-goods/goods/detailAdd", data: data
  })
}
// 修改商品详情
export function updateGoodsDetail(data) {
  return request({
    url: "/api-goods/goods/detailUpdate", data: data
  })
}
// 综合操作商品sku
export function batchOtGoodsSku(data) {
  return request({
    url: "/api-goods/goods/skuBatchOt", data: data
  })
}
// 修改商品状态
export function updateGoodsStatus(data) {
  return request({
    url: "/api-goods/goods/updateStatus", data: data
  })
}
// 复制商品
export function copyGoods(data) {
  return request({
    url: "/api-goods/goods/copyGoods", data: data
  })
}
// 查询所有品牌列表
export function getAppBrandList(data) {
  return request({
    url: "/api-goods/goodsBrand/list", data
  })
}
/**
 * =========================================================
 * 
 *                        营销管理
 *
 *  =========================================================
 */

// 获取可以参加获得的活动列表
export function getActCommonPageList(data) {
  return request({
    url: "/api-goods/goodsActCommon/pageList", data: data
  })
}
// 分页获取全部有效的活动模块
export function getActCommonAllList(data) {
  return request({
    url: "/api-goods/goodsActCommon/list", data
  })
}
// 获取商家参加有效的活动列表
export function getActStorePackList(data) {
  return request({
    url: "/api-goods/goodsActStorePack/list", data: data
  })
}
// 获取商家参加有效的活动栏目列表
export function getActStorePackColumnList(data) {
  return request({
    url: "/api-goods/goodsActStorePack/getPackByStore", data: data
  })
}
// 获取活动绑定的活动套餐列表
export function getActBindPackList(data) {
  return request({
    url: "/api-goods/goodsActBindPack/list", data: data
  })
}
// 根据packCode获取活动套餐信息
export function getActPackInfo(data) {
  return request({
    url: "/api-goods/goodsActPack/get", data: data
  })
}
// 分页获取不同类型活动类型商品
export function getActGoodsPageList(data) {
  return request({
    url: "/api-goods/goodsAct/pageList", data: data
  })
}
// 批量添加活动商品
export function addActGoods(data) {
  return request({
    url: "/api-goods/goodsAct/add", data: data
  })
}
// 批量删除活动商品
export function delActGoods(data) {
  return request({
    url: "/api-goods/goodsAct/delete", data: data
  })
}
// 修改活动商品状态
export function updateActGoodsStatus(data) {
  return request({
    url: "/api-goods/goodsAct/updateStatus",
    data: data
  })
}
// 分页获取店铺的广告图列表
export function getActAdvertisePageList(data) {
  return request({
    url: "/api-goods/goodsActAdvertise/pageList", data: data
  })
}
// 添加活动广告图
export function addActAdvertise(data) {
  return request({
    url: "/api-goods/goodsActAdvertise/add", data: data
  })
}
// 删除活动广告图
export function delActAdvertise(data) {
  return request({
    url: "/api-goods/goodsActAdvertise/delete", data: data
  })
}
// 修改活动广告图状态
export function updateActAdvertiseStatus(data) {
  return request({
    url: "/api-goods/goodsActAdvertise/updateStatus", data: data
  })
}
// 批量添加代卖活动商品
export function addActPushGoods(data) {
  return request({
    url: "/api-goods/goodsPushGoods/add", data: data
  })
}
// 批量删除代卖商品
export function delActPushGoods(data) {
  return request({
    url: "/api-goods/goodsPushGoods/delete", data: data
  })
}
// 获取代卖商品列表
export function getActPushGoodsPageList(data) {
  return request({
    url: "/api-goods/goodsPushGoods/pageList", data: data
  })
}
// 修改代卖商品状态
export function updatePushGoodsStatus(data) {
  return request({
    url: "/api-goods/goodsPushGoods/updateStatus", data: data
  })
}

/**
 * =========================================================
 * 
 *                        店铺推荐, 新品
 *
 *  =========================================================
 */

// 根据店铺查询推荐商品
export function getGoodsByStore(data) {
  return request({
    url: "/api-goods/goodsRecommend/getGoodsByStore", data: data
  })
}

// 获取店铺可以新增的推荐商品
export function getRecommendGoodsPageList(data) {
  return request({
    url: "/api-goods/goodsRecommend/getRecommendGoodsPageList", data: data
  })
}

// 批量新增推荐商品
export function addGoodsRecommend(data) {
  return request({
    url: "/api-goods/goodsRecommend/add", data: data
  })
}

// 批量删除推荐商品
export function delGoodsRecommend(data) {
  return request({
    url: "/api-goods/goodsRecommend/delete", data: data
  })
}


// 根据店铺查询新品商品
export function getGoodsNewsByStore(data) {
  return request({
    url: "/api-goods/goodsNews/getGoodsByStore", data: data
  })
}

// 获取店铺可以新增的新品商品
export function getGoodsNewsPageList(data) {
  return request({
    url: "/api-goods/goodsNews/getNewsGoodsPageList", data: data
  })
}

// 批量新增新品商品
export function addGoodsNews(data) {
  return request({
    url: "/api-goods/goodsNews/add", data: data
  })
}

// 批量删除新品商品
export function delGoodsNews(data) {
  return request({
    url: "/api-goods/goodsNews/delete", data: data
  })
}

/** 
 * =========================================================
 *                          数字货架商品管理
 * ==========================================================
 */
// 分页查看云店推送商品列表（根据条件查询，具体看入参实体）
export function getPushGoodsList(data) {
  return request({
    url: "/api-goods/cloudStore/pushGoodsList", data
  })
}
// 修改云店商品
export function updatePushGoods(data) {
  return request({
    url: "/api-goods/cloudStore/pushGoodsEdit", data
  })
}
// 批量删除商品
export function delPushGoods(data) {
  return request({
    url: "/api-goods/cloudStore/pushGoodsDel", data
  })
}
// 供应商推送商品到云店
export function pushGoodsToStore(data) {
  return request({
    url: "/api-goods/cloudStore/pushGoodsToStore", data
  })
}
// 根据当前商品ID分页查询可推送的店铺列表
export function getPushStoreList(data) {
  return request({
    url: "/api-goods/cloudStore/pushStoreList", data
  })
}
// 批量修改供应商供应商品状态
export function updateCloudStoreStatus(data) {
  return request({
    url: "/api-goods/cloudStore/updateStatus", data
  })
}
/** 
 * =========================================================
 *                          数字货架列表管理
 * ==========================================================
 */
// 分页获取绑定的云店列表
export function getBindStoreList(data) {
  return request({
    url: "/api-goods/cloudStore/bindStoreList", data
  })
}
// 修改绑定的云店信息
export function updateBindStore(data) {
  return request({
    url: "/api-goods/cloudStore/bindStoreEdit", data
  })
}
// 删除绑定的云店
export function delBindStore(data) {
  return request({
    url: "/api-goods/cloudStore/bindStoreDel", data
  })
}
// 新增云店绑定
export function addBindStore(data) {
  return request({
    url: "/api-goods/cloudStore/bindStoreAdd", data
  })
}
