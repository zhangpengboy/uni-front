import request from '@/utils/request'


/** 
 * =========================================================
 *                          活动表列表
 * ==========================================================
 */

// 获取字典列表
export function dictPageList(data) {
    return request({
        url: '/api-goods/goodsActTableDict/pageList', data
    })
}

// 添加字典列表
export function dictAdd(data) {
    return request({
        url: '/api-goods/goodsActTableDict/add', data
    })
}

// 修改字典列表
export function dictUpdate(data) {
    return request({
        url: '/api-goods/goodsActTableDict/update', data
    })
}

// 删除字典列表
export function dictDelete(data) {
    return request({
        url: '/api-goods/goodsActTableDict/delete', data
    })
}

// 获取可用的表名列表
export function getUsableActTable() {
    return request({
        url: '/api-goods/goodsActTableDict/getUsableActTable',
    })
}

// 根据actCode获取字典表数据
export function goodsActTableDict(data) {
    return request({
        url: '/api-goods/goodsActTableDict', data
    })
}


/** 
 * =========================================================
 *                          活动字典code列表
 * ==========================================================
 */

// 添加活动code
export function addActCode(data) {
    return request({
        url: '/api-superadmin/v2/appAct/add', data
    })
}
// 根据上级actCode获取下级列表
export function getActChildeList(data) {
    return request({
        url: '/api-superadmin/v2/appAct/childList', data
    })
}
// 分页获取活动code列表
export function getActCodePageList(data) {
    return request({
        url: '/api-superadmin/v2/appAct/pageList', data
    })
}
// 修改活动状态
export function updateActCodeStatus(data) {
    return request({
        url: '/api-superadmin/v2/appAct/updateStatus', data
    })
}
// 修改活动
export function updateActCode(data) {
    return request({
        url: '/api-superadmin/v2/appAct/update', data
    })
}
// 修改活动
export function deleteActCode(data) {
    return request({
        url: '/api-superadmin/v2/appAct/delete', data
    })
}