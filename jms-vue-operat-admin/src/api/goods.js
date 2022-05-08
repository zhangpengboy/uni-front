/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-15 19:39:58
 * @Description : 商品服务
 */

import request from '@/utils/request'

/**
 * ========================================================
 *                        商品列表管理
 * ========================================================
 */
// 商品列表
export function getGoodsPageList (data) {
  return request({
    url: '/api-goods/goods/pageList',
    data
  })
}
// 获取商品基础信息
export function getGoodsBase (data) {
  return request({
    url: '/api-goods/goods/detail',
    data
  })
}
// 获取商品详情信息
export function getGoodsInfo (data) {
  return request({
    url: '/api-goods/goods/detailInfo',
    data
  })
}
// 获取商品SKU列表
export function getGoodsSkuList (data) {
  return request({
    url: '/api-goods/goods/skuList',
    data
  })
}
// 修改商品状态 | 上架|下架|审核
export function updateGoodsStatus (data) {
  return request({
    url: '/api-goods/goods/updateStatus',
    data
  })
}
// 修改商品基础信息
export function updateGoods (data) {
  return request({
    url: '/api-goods/goods/update',
    data
  })
}
// 修改商品权重
export function updateGoodsPageList(data) {
  return request({
    url: "/api-goods/goods/updateWeight",
    data
  })
}
// 创建商品详情
export function addGoodsDetail (data) {
  return request({
    url: '/api-goods/goods/detailAdd',
    data: data
  })
}
// 修改商品详情
export function updateGoodsDetail (data) {
  return request({
    url: '/api-goods/goods/detailUpdate',
    data: data
  })
}
// 综合操作商品sku
export function batchOtGoodsSku (data) {
  return request({
    url: '/api-goods/goods/skuBatchOt',
    data
  })
}
// 删除商品
export function deleteStoreInfo (data) {
  return request({
    url: '/api-goods/goods/delete',
    data: data
  })
}
/**
 * ========================================================
 *                      街市商品列表管理
 * ========================================================
 */


// 获取街市商品列表
export function getStreetPageList (data) {
  return request({
    url: '/api-goods/streetGoods/admin/pageList',
    data: data
  })
}
// 获取街市商品详情
export function getStreetGoodsDetail (data) {
  return request({
    url: '/api-goods/streetGoods/detail',
    data: data
  })
}
// 删除街市商品
export function delStreetGoods (data) {
  return request({
    url: '/api-goods/streetGoods/delete',
    data: data
  })
}
// 审核街市商品
export function updateStreetGoodsStatus (data) {
  return request({
    url: '/api-goods/streetGoods/updateStatus',
    data: data
  })
}
// 修改街市商品
export function updateStreetGoods (data) {
  return request({
    url: '/api-goods/streetGoods/update',
    data: data
  })
}
// 街市商品分类
export function getStreetGoodsCategory (data) {
  return request({
    url: '/api-goods/streetGoodsCategory/list',
    data: data
  })
}
/**
 * ========================================================
 *                      商品分类管理
 * ========================================================
 */

// 获取商品分类
export function getGoodsCateList (data) {
  return request({
    url: '/api-goods/goodsCategory/list',
    data
  })
}
// 添加商品分类
export function addGoodsCate (data) {
  return request({
    url: '/api-goods/goodsCategory/add',
    data
  })
}
// 修改商品分类
export function updateGoodsCate (data) {
  return request({
    url: '/api-goods/goodsCategory/update',
    data
  })
}
// 获取商品分类
export function getGoodsCate (data) {
  return request({
    url: '/api-goods/goodsCategory/detail',
    data
  })
}
/**
 * ========================================================
 *                      品牌管理管理
 * ========================================================
 */

// 分页查询品牌列表
export function getAppBrandPageList (data) {
  return request({
    url: '/api-goods/goodsBrand/pageList',
    data
  })
}
// 查询所有品牌列表
export function getAppBrandList (data) {
  return request({
    url: '/api-goods/goodsBrand/list',
    data
  })
}
// 修改品牌
export function updateAppBrand (data) {
  return request({
    url: '/api-goods/goodsBrand/update',
    data
  })
}
// 新增品牌
export function addAppBrand (data) {
  return request({
    url: '/api-goods/goodsBrand/add',
    data
  })
}
// 获取品牌详情
export function getAppBrandDetail (data) {
  return request({
    url: '/api-goods/goodsBrand/detail',
    data
  })
}
// 删除品牌
export function deleteAppBrand (data) {
  return request({
    url: '/api-goods/goodsBrand/delete',
    data
  })
}

/**
 * ==========================================================
 *                        活动模块
 * ==========================================================
 */
// 分页获取活动模块列表
export function getActCommonList (data) {
  return request({
    url: '/api-goods/goodsActCommon/pageList',
    data
  })
}
// 分页获取全部有效的活动模块
export function getActCommonAllList (data) {
  return request({
    url: '/api-goods/goodsActCommon/list',
    data
  })
}
// 添加营销活动模块
export function addActCommon (data) {
  return request({
    url: '/api-goods/goodsActCommon/add',
    data
  })
}
// 删除营销活动模块
export function delActCommon (data) {
  return request({
    url: '/api-goods/goodsActCommon/delete',
    data
  })
}
// 修改营销活动模块
export function updateActCommon (data) {
  return request({
    url: '/api-goods/goodsActCommon/update',
    data
  })
}
// 获取营销活动模块信息
export function getActCommon (data) {
  return request({
    url: '/api-goods/goodsActCommon/detail',
    data
  })
}
// 获取活动模块子级列表
export function getActCommonChildrenList (data) {
  return request({
    url: '/api-goods/goodsActCommon/getChildrenByCode',
    data
  })
}
// 编辑活动子模块店铺角色
export function editActCommonChildrenRole (data) {
  return request({
    url: '/api-goods/goodsActCommon/editStoreRole',
    data
  })
}

// 同步自营店添加所有活动栏目
export function storeSyncAct (data) {
  return request({
    url: '/api-goods/goodsActCommon/storeSyncAct',
    data
  })
}

// 修改活动商品权重
export function updateGoodsWeight (data) {
  return request({
    url: '/api-goods/goodsAct/updateWeight',
    data: data
  })
}

// 添加活动code
export function addAppAct (data) {
  return request({
    url: '/api-superadmin/v2/appAct/add',
    data
  })
}
// 根据上级actCode获取下级列表
export function getAppActChildList (data) {
  return request({
    url: '/api-superadmin/v2/appAct/childList',
    data
  })
}

/**
 * ==========================================================
 *                           活动套餐
 * ==========================================================
 */
// 获取所有营销活动的套餐列表
export function getActCommonPackAllList (data) {
  return request({
    url: '/api-goods/goodsActPack/list',
    data
  })
}
// 营销活动套餐列表
export function getActCommonPackList (data) {
  return request({
    url: '/api-goods/goodsActPack/pageList',
    data
  })
}
// 添加活动套餐
export function addActCommonPack (data) {
  return request({
    url: '/api-goods/goodsActPack/add',
    data
  })
}
// 删除活动套餐
export function delActCommonPack (data) {
  return request({
    url: '/api-goods/goodsActPack/delete',
    data
  })
}
// 修改活动套餐
export function updateActCommonPack (data) {
  return request({
    url: '/api-goods/goodsActPack/update',
    data
  })
}
// 获取活动套餐信息
export function getActCommonPack (data) {
  return request({
    url: '/api-goods/goodsActPack/detail',
    data
  })
}
// 获取商家参加有效的活动栏目列表
export function getActStorePackColumnList (data) {
  return request({
    url: '/api-goods/goodsActStorePack/getPackByStore',
    data: data
  })
}

/**
 * ==========================================================
 *                           活动模块-活动套餐
 * ==========================================================
 */
// 活动模块绑定的活动套餐列表
export function getActBindPackList (data) {
  return request({
    url: '/api-goods/goodsActBindPack/list',
    data
  })
}
// 活动模块绑定活动套餐
export function addActBindPack (data) {
  return request({
    url: '/api-goods/goodsActBindPack/add',
    data
  })
}
// 删除活动模块绑定的活动套餐列表
export function delActBindPack (data) {
  return request({
    url: '/api-goods/goodsActBindPack/delete',
    data
  })
}

/**
 * ==========================================================
 *                           活动商品管理
 * ==========================================================
 */
// 分页获取不同类型
export function getActGoodsPageList (data) {
  return request({
    url: '/api-goods/goodsAct/pageList',
    data
  })
}
// 批量添加活动商品
export function addActGoods (data) {
  return request({
    url: '/api-goods/goodsAct/add',
    data
  })
}
// 批量删除活动商品
export function delActGoods (data) {
  return request({
    url: '/api-goods/goodsAct/delete',
    data
  })
}
// 修改活动商品状态
export function updateActGoodsStatus (data) {
  return request({
    url: '/api-goods/goodsAct/updateStatus',
    data
  })
}

/**
 * =========================================================
 *                          广告图管理
 * ==========================================================
 */
// 分页获取店铺的广告图列表
export function getActAdvertisePageList (data) {
  return request({
    url: '/api-goods/goodsActAdvertise/pageList',
    data
  })
}
// 添加活动广告图
export function addActAdvertise (data) {
  return request({
    url: '/api-goods/goodsActAdvertise/add',
    data: data
  })
}
// 删除活动广告图
export function delActAdvertise (data) {
  return request({
    url: '/api-goods/goodsActAdvertise/delete',
    data: data
  })
}
// 修改活动广告图状态
export function updateActAdvertiseStatus (data) {
  return request({
    url: '/api-goods/goodsActAdvertise/updateStatus',
    data: data
  })
}
// 修改活动广告图详情
export function updateActAdvertise (data) {
  return request({
    url: '/api-goods/goodsActAdvertise/update',
    data: data
  })
}

/**
 * =========================================================
 *                          活动表配置管理
 * ==========================================================
 */
// 活动绑定表列表
export function getActRefTableList (data) {
  return request({
    url: '/api-goods/goodsActRefTable/pageList',
    data
  })
}
// 添加活动绑定表
export function addActRefTable (data) {
  return request({
    url: '/api-goods/goodsActRefTable/add',
    data
  })
}
// 删除活动绑定表
export function delActRefTable (params) {
  return request({
    url: '/api-goods/goodsActRefTable/delete',
    params: params
  })
}
// 修改活动绑定表
export function updateActRefTable (data) {
  return request({
    url: '/api-goods/goodsActRefTable/update',
    data
  })
}
// 获取活动绑定表
export function getActRefTable (params) {
  return request({
    url: '/api-goods/goodsActRefTable/detail',
    params: params
  })
}

/**
 * =========================================================
 *                          数字货架列表管理
 * ==========================================================
 */
// 分页获取绑定的云店列表
export function getBindStoreList (data) {
  return request({
    url: '/api-goods/cloudStore/bindStoreList',
    data
  })
}
// 修改绑定的云店信息
export function updateBindStore (data) {
  return request({
    url: '/api-goods/cloudStore/bindStoreEdit',
    data
  })
}
// 删除绑定的云店
export function delBindStore (data) {
  return request({
    url: '/api-goods/cloudStore/bindStoreDel',
    data
  })
}
// 新增云店绑定
export function addBindStore (data) {
  return request({
    url: '/api-goods/cloudStore/bindStoreAdd',
    data
  })
}
// 获取可添加数字货架店铺列表
export function getBindPushStoreList (data) {
  return request({
    url: '/api-store/storeinfo/pushStoreList',
    data
  })
}

/**
 * =========================================================
 *                          数字货架商品管理
 * ==========================================================
 */
// 分页查看云店推送商品列表（根据条件查询，具体看入参实体）
export function getPushGoodsList (data) {
  return request({
    url: '/api-goods/cloudStore/pushGoodsList',
    data
  })
}
// 修改云店商品
export function updatePushGoods (data) {
  return request({
    url: '/api-goods/cloudStore/pushGoodsEdit',
    data
  })
}
// 批量删除商品
export function delPushGoods (data) {
  return request({
    url: '/api-goods/cloudStore/pushGoodsDel',
    data
  })
}
// 供应商推送商品到云店
export function pushGoodsToStore (data) {
  return request({
    url: '/api-goods/cloudStore/pushGoodsToStore',
    data
  })
}
// 根据当前商品ID分页查询可推送的店铺列表
export function getPushStoreList (data) {
  return request({
    url: '/api-goods/cloudStore/pushStoreList',
    data
  })
}
// 批量修改供应商供应商品状态
export function updateCloudStoreStatus (data) {
  return request({
    url: '/api-goods/cloudStore/updateStatus',
    data
  })
}
// 收益发放
export function incomeDistribution (data) {
  return request({
    url: '/api-money/income/displayIncomeDistribution',
    data
  })
}

/**
 * =========================================================
 *                          数字货架导出
 * ==========================================================
 */

// 运营导出数字货架的商品列表信息
export function exportCloudGoodsExcel (data, type) {
  return request({
    url: '/api-goods/cloudStore/' + type,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    responseType: 'blob',
    timeout: 6000000,
    params: data,
    method: 'get'
  })
}
// 运营导出数字货架的店铺列表信息
export function exportCloudStoreExcel (data) {
  return request({
    url: '/api-goods/cloudStore/export',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    responseType: 'blob',
    timeout: 6000000,
    params: data,
    method: 'get'
  })
}

// 批量导出店铺图片params: params
// export function downloadCloudStore(data) {
//   return request({
//     url: "/api-goods/cloudStore/download",
//     data: data,
//     // timeout: 6000000,
//     // responseType: 'arraybuffer',
//     // params: data,
//     // method: 'get',
//   })
// }
// 数字货架单个商品二维码导出(base64)
export function downloadGoodsQrcode (data) {
  return request({
    url: '/api-goods/cloudStore/goodsQrcode',
    data: data,
    timeout: 6000000
    // responseType: 'arraybuffer',
    // params: data,
    // method: 'get',
  })
}

/**
 * =========================================================
 *                          数字货架分润配置
 * ==========================================================
 */
// 查询分润任务列表
export function getIncomeTask (data) {
  return request({
    url: '/api-money/incomeTask/pageList',
    data
  })
}
// 查询数字货架分润配置分页列表
export function getIncomeCloudStoreList (data) {
  return request({
    url: '/api-money/incomeCloudStore/pageList',
    data
  })
}
// 新增数字货架分润配置
export function addIncomeCloudStore (data) {
  return request({
    url: '/api-money/incomeCloudStore/add',
    data
  })
}
// 修改数字货架分润配置
export function updateIncomeCloudStore (data) {
  return request({
    url: '/api-money/incomeCloudStore/update',
    data
  })
}
// 批量删除数字货架分润配置
export function deleteIncomeCloudStore (data) {
  return request({
    url: '/api-money/incomeCloudStore/delete',
    data
  })
}
// 数字货架分润配置 详情
export function getIncomeCloudStoreDetail (data) {
  return request({
    url: '/api-money/incomeCloudStore/detail',
    data
  })
}

// 查询所有业务列表
export function getAppBusinessDictList (data) {
  return request({
    url: '/api-superadmin/appBusinessDict/list',
    data
  })
}

/**
 * =========================================================
 *                          礼券妈妈店铺列表
 * ==========================================================
 */

// 查询店铺列表
export function getStoreGiftMotherList (data) {
  return request({
    url: '/api-store/storeGiftMother/pageList',
    data
  })
}

/**
 * =========================================================
 *                          礼券妈妈商品列表
 * ==========================================================
 */

// 查询商品列表
export function getGoodsGiftMotherList (data) {
  return request({
    url: '/api-goods/giftMother/pushGoodsList',
    data
  })
}
// 供应商推送商品到礼券妈妈
export function pushGoodsToGiftMotherStore (data) {
  return request({
    url: '/api-goods/giftMother/pushGoodsToStore',
    data
  })
}
// 批量删除礼券妈妈商品
export function delGiftMotherGoods (data) {
  return request({
    url: '/api-goods/giftMother/pushGoodsDel',
    data
  })
}
// 根据当前商品ID分页查询可推送的礼券妈妈店铺列表
export function getPushStoreGiftMotherList (data) {
  return request({
    url: '/api-goods/giftMother/pushStoreList',
    data
  })
}

/**
 * =========================================================
 *                          礼券妈妈商品分润配置
 * ==========================================================
 */
// 删除商品分润配置
export function delIncomeGiftMothert (data) {
  return request({
    url: '/api-money/incomeGiftMother/deleteByGoods',
    data
  })
}
// 详情
export function getIncomeGiftMotherDetail (data) {
  return request({
    url: '/api-money/incomeGiftMother/detail',
    data
  })
}

// 新增/修改礼券妈妈分润
export function updateIncomeGiftMother (data) {
  return request({
    url: '/api-money/incomeGiftMother/update',
    data
  })
}

/**
 * =========================================================
 *                          便利店商品库
 * ==========================================================
 */
// 列表查询
export function storeGoodsBasePageList (data) {
  return request({
    url: '/api-goods/storeGoodsBase/pageList',
    data
  })
}
// 添加商品基础信息
export function storeGoodsBaseAdd (data) {
  return request({
    url: '/api-goods/storeGoodsBase/add',
    data
  })
}
// 修改商品基础信息
export function storeGoodsBaseUpdate (data) {
  return request({
    url: '/api-goods/storeGoodsBase/update',
    data
  })
}
// 添加商品sku信息
export function storeGoodsBaseAddSku (data) {
  return request({
    url: '/api-goods/storeGoodsBase/addSku',
    data
  })
}
// 批量操作sku信息
export function storeGoodsBaseSkuBatchOt (data) {
  return request({
    url: '/api-goods/storeGoodsBase/skuBatchOt',
    data
  })
}
// 获取商品基础信息
export function storeGoodsBaseGetGoodsBase (data) {
  return request({
    url: '/api-goods/storeGoodsBase/getGoodsBase',
    data
  })
}
// 获取商品sku信息
export function storeGoodsBaseGetGoodsBaseSku (data) {
  return request({
    url: '/api-goods/storeGoodsBase/getGoodsBaseSku',
    data
  })
}
// 便利店店铺商品分类列表
export function goodsCategoryList (data) {
  return request({
    url: '/api-goods/storeGoods/goodsCategory/pageList',
    data
  })
}
// 便利店店铺商品分类列表不分页
export function storeGoodsBaseCateGory (data) {
  return request({
    url: '/api-goods/storeGoods/goodsCategory/list',
    data
  })
}
// 便利店店铺商品分类添加
export function goodsCategoryAdd (data) {
  return request({
    url: '/api-goods/storeGoods/goodsCategory/add',
    data
  })
}
// 便利店店铺商品分类修改/删除/修改状态
export function goodsCategoryUpdate (data) {
  return request({
    url: '/api-goods/storeGoods/goodsCategory/update',
    data
  })
}
