/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-11 18:33:58
 * @Description : 提现审核
 */

import request from "@/utils/request"

// 查询提现流水
export function moneyDrawPageList(data) {
    return request({
        url: "/api-money/moneyDraw/pageList", data
    })
}

// 提现到支付宝  通过审核
export function drawAlipay(data) {
    return request({
        url: "/api-money/moneyDraw/drawAlipay", data
    })
}
// 提现到支付宝  拒绝审核
export function noApply(data) {
    return request({
        url: "/api-money/moneyDraw/noApply", data
    })
}

/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-11 18:33:58
 * @Description : 分润管理
 */

export function incomeTask(data) {
    return request({
        url: "/api-money/incomeTask/pageList", data
    })
}

// 支付宝解绑
export function delMoneyBindAcct(data) {
    return request({
        url: "/api-money/moneyBindAcct/deleteAlipay", data
    })
}
// 支付宝绑定查询
export function getMoneyBindAcct(data) {
    return request({
        url: "/api-money/moneyBindAcct/get/getAlipayUser", data
    })
}
// 支付宝绑定修改
export function updateMoneyBindAcct(data) {
    return request({
        url: "/api-money/moneyBindAcct/update/deleteAlipay", data
    })
}

// 查询对公账号余额
export function alipayBalance(data) {
    return request({
        url: "/api-money/alipay/balance.query", data
    })
}
// 获取用户资产流水
export function userMoneyList(data) {
    return request({
        url: "/api-money/money/list", data
    })
}
// 统计当前用户|店铺可用余额、提现余额、转移余额
export function countMoneyTotal(data) {
    return request({
        url: "/api-money/money/countMoneyTotal", data
    })
}

// 根据手机号查用户全部积分流水
export function integralList(data) {
    return request({
        url: "/api-integral/gralV2/get/integralList", data
    })
}

// 店东收益发放
export function displayStoreIncomeDistribution(data) {
    return request({
        url: "/api-money/incomeStore/displayStoreIncomeDistribution",
        responseType: 'blob',
        timeout: 6000000,
        data: data,
    })
}
// 代理商收益发放
export function displayAgentIncomeDistribution(data) {
    return request({
        url: "/api-money/incomeAgent/displayAgentIncomeDistribution",
        responseType: 'blob',
        timeout: 6000000,
        data: data,
    })
}
// 店铺提现配置列表
export function moneyDrawList(data) {
    return request({
        url: "/api-money/moneyRate/list",
        data: data,
    })
}
// 添加店铺提现配置
export function moneyRateAdd(data) {
    return request({
        url: "/api-money/moneyRate/add",
        data: data,
    })
}
// 修改店铺提现配置列表
export function moneyRateUpdate_v2(data) {
    return request({
        url: "/api-money/moneyRate/update_v2",
        data: data,
    })
}
// 查询分润任务列表
export function getIncomeTaskPageList(data) {
    return request({
        url: "/money-sharing/incomeTask/pageList",
        data: data,
    })
}
// 修改分润任务状态
export function incomeTaskUpdateStatus(data) {
    return request({
        url: "/money-sharing/incomeTask/updateStatus",
        data: data,
    })
}