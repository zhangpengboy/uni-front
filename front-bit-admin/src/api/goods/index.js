/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-26 11:05:50
 * @Description  : 商品管理 - 请求接口
 */

import request from '@/utils/request'
/** 
 * ========================================================
 *                        商品列表管理
 * ========================================================
 */

/**
 * @description: 矿机列表
 */
export function getGoodsPageList(params) {
  return request({
    url: '/api-admin/product/list', params
  })
}

/**
 * @description: 获取商品基础信息
 */
export function getGoodsBase(params) {
  return request({
    url: '/api-admin/product/get', params
  })
}

/**
 * @description: 添加、修改矿机基础信息
 */
export function addUpdateGoodsBase(data) {
  return request({
    url: '/api-admin/product/addUpdateProduct', data
  })
}


/**
 * @description: 获取商品详情信息
 */
export function getGoodsDetail(params) {
  return request({
    url: '/api-admin/product/detail', params
  })
}

/**
 * @description: 添加、修改矿机详情
 */
export function addUpdateGoodsDetail(data) {
  return request({
    url: '/api-admin/product/addUpdateDetail', data
  })
}
/**
 * @description: 获取商品sku-list
 */
export function getGoodsSkuList(params) {
  return request({
    url: '/api-admin/product/listPack', params
  })
}
/**
 * @description: 添加、修改矿机详情
 */
export function addUpdateGoodsPack(data) {
  return request({
    url: '/api-admin/product/addUpdatePack', data
  })
}

/**
 * @description: 删除矿机sku
 */
export function delGoodsPack(params) {
  return request({
    url: '/api-admin/product/delPack', params
  })
}
/**
 * @description: 修改商品状态 | 上架|下架|审核
 */
export function updateGoodsStatus(params) {
  return request({
    url: '/api-admin/product/updateStatus', params
  })
}