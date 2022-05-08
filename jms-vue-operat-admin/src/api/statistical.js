/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-06-15 23:46:22
 * @Description : TODO
 */
/*
 * @Description : 报表统计服务模块
 */

import request from '@/utils/request'

/** 
 * ========================================================
 *                       礼券流水
 * ========================================================
 **/
// 根据手机号查用户积分流水
export function getIntegralPushList(data) {
    return request({
        url: "/api-integral/gralV2/get/getIntegralPushList", data
    })
}
// 礼券赠送流水导出
export function downloadGiftSerialExl(params) {
    return request({
        url: "/api-integral/gralV2/orderIntegralExport",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        responseType: "blob",
        timeout: 6000000,
        method: 'get',
        params
    })
}
// 积分最多的前几十名
export function getUserIntegralMax(data) {
    return request({
        url: "/api-integral/gralV2/get/userIntegralMax",data
    })
}
// 用户资产列表
export function getUserIntegralList(data) {
    return request({
        url: "/api-integral/statistical/pageListByUser",data
    })
}
// 店铺资产列表
export function getStoreIntegralList(data) {
    return request({
        url: "/api-integral/statistical/pageListByStore",data
    })
}
/**
 * 获取积分区间内列表
 * @param {*} data 
 */
export function getUserTodayIntegralList(data) {
    return request({
        url: "/api-integral/statistical/userTotalLog",data
    })
}

// 店铺礼券流水统计导出
export function downloadUserIntegralMaxExport(params) {
    return request({
        url: "/api-integral/gralV2/userIntegralMax/export",// /api-integral/gralV2/userIntegralMax/export
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        responseType: "blob",
        timeout: 6000000,
        method: 'get',
        params
    })
}

// 店铺每日的流水统计 
export function getStoreMoneyList(data) {
    return request({
        url: "/api-money/money/get/storeMoneyList",data
    })
}
// 店铺礼券流水统计导出
export function downloadMoneyExport(params) {
    return request({
        url: "/api-money/money/moneyExport/get",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        responseType: "blob",
        timeout: 6000000,
        method: 'get',
        params
    })
}

// 获取所有店铺礼券赠送配置
export function getAllStoreIntegralSend(data) {
    return request({
        url: "/api-store/store/integrals/getAllStoreIntegralSend",data
    })
}

// 店铺礼券流水
export function storeOrderIntegralList(data) {
    return request({
        url: "/api-order/orderV2/storeOrderIntegralList",data
    })
}