import request from '@/utils/request'


/** 
 * =========================================================
 *                          APP更新
 * ==========================================================
 */

// 获取字典列表
export function appPageList(data) {
    return request({
        url: '/api-superadmin/app/pageList',
        data
    })
}
// 保存IOS/Android 安装包信息
export function addApp(data) {
    return request({
        url: '/api-superadmin/app/add',
        data
    })
}
// 保存IOS/Android 安装包信息
export function updateApp(data) {
    return request({
        url: '/api-superadmin/app/update',
        data
    })
}

/** 
 * =========================================================
 *                          业务类型
 * ==========================================================
 */
// 查询所有业务列表
export function appBusinessDictList(data) {
    return request({
        url: '/api-superadmin/appBusinessDict/list',
        data
    })
}
