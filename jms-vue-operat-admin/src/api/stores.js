/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-14 19:31:08
 * @Description : 订单服务模块
 */

import request from '@/utils/request'

/**
 * ========================================================
 *                       店铺分类管理
 * ========================================================
 **/
// 获取-店铺分类列表
export function getStoreCategoryList (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateList',
    data
  })
}
// 添加-店铺分类
export function addStoresCategory (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateAdd',
    data
  })
}
// 获取详情-店铺分类
export function getStoresCategoryDetail (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateInfo',
    data
  })
}
// 修改-店铺分类
export function updateStoresCategory (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateEdit',
    data
  })
}
// 删除-店铺分类
export function deleteStoresCategory (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateDel',
    data
  })
}
// 店铺审核绑定店铺分类-商品分类关系
export function bindStoreGoodsCategory (data) {
  return request({
    url: '/api-store/storeAdmin/storeCateBind',
    data
  })
}
// 查询所有有效店铺列表
export function getStoreInfoAllList (data) {
  return request({
    url: '/api-store/storeinfo/getStoreInfoAllList',
    data
  })
}
/**
 * ========================================================
 *                       商户管理
 * ========================================================
 **/

// 获取-商户入驻列表
export function getStoreList (data) {
  return request({
    url: '/api-store/storeAdmin/storeAcctList',
    data
  })
}
// 审核-商户入驻审核状态
export function updateStoreAuditStatus (data) {
  return request({
    url: '/api-store/storeAdmin/storeAcctAudit',
    data
  })
}
// 运营管理修改重置商家密码
export function resetPwd (data) {
  return request({
    url: '/api-store/account/resetPwd',
    data
  })
}
// 修改店铺赠送积分配置
export function updateConfig (data) {
  return request({
    url: '/api-store/store/integrals/updateConfig',
    data
  })
}
/**
 * ========================================================
 *                       店铺管理
 * ========================================================
 **/
// 获取-店铺列表
export function getStoreInfoList (data) {
  return request({
    url: '/api-store/storeAdmin/storeInfoList',
    data
  })
}
// 店铺启用/禁用第三方支付
export function switchThirdPay (data) {
  return request({
    url: '/api-store/storeinfo/switchThirdPay',
    data
  })
}
// 店铺启用/禁用礼券时扣
export function switchRealTimePay (data) {
  return request({
    url: '/api-store/storeinfo/switchRelTime',
    data
  })
}
// 修改-店铺审核状态
export function updateStoreInfoStatus (data) {
  return request({
    url: '/api-store/storeAdmin/storeInfoAudit',
    data
  })
}

// 店铺启用
export function storeEnable (data) {
  return request({
    url: '/api-store/storeAdmin/storeEnable',
    data
  })
}
// 获取店铺经营类别
export function getStoreCategeAllList () {
  return request({
    url: '/api-store/storeinfo/storeCateList'
  })
}
// 获取省市区街道地址
export function getStoreAreaList (data) {
  return request({
    url: '/api-store/storeArea/list',
    data
  })
}
// 获取店铺详情
export function getStoreDetailInfo (data) {
  return request({
    url: '/api-store/storeinfo/detail',
    data
  })
}
// 修改店铺
export function updateStoreInfo (data) {
  return request({
    url: '/api-store/storeinfo/update',
    data: data
  })
}
// 获取当前店铺绑定的商品分类
export function getStoreGoodsCate (data) {
  return request({
    url: '/api-store/storeAdmin/storeGoodsCate',
    data
  })
}
// 修改店铺商品经营类别
export function updateGetcateGory (data) {
  return request({
    url: '/api-store/storeAdmin/update/cateGory',
    data
  })
}
// 根据手机号获取店铺列表
export function getStoreInfoByPhone (data) {
  return request({
    url: '/api-store/storeinfo/getStoreInfoByPhone',
    data
  })
}
// 修改店铺角色
export function updateStoreRole (data) {
  return request({
    url: '/api-store/storeinfo/updateRole',
    data
  })
}
/**
 * ========================================================
 *                       语音播报管理
 * ========================================================
 **/
// 用户绑定收款音响
export function storeVoiceBindUser (data) {
  return request({
    url: '/api-im/hwBind/bindUser',
    data
  })
}
// 用户修改收款音响
export function storeVoiceEditUser (data) {
  return request({
    url: '/api-im/hwBind/updateStore',
    data
  })
}
// 根据用户查询收款音响列表
export function storeVoiceListByUser (data) {
  return request({
    url: '/api-im/hwBind/listByUser',
    data
  })
}
// 根据id删除收款音响
export function storeVoiceDeleteById (data) {
  return request({
    url: '/api-im/hwBind/deleteById',
    data
  })
}
// 解绑收款音响
export function storeVoiceUnbind (data) {
  return request({
    url: '/api-im/hwBind/unbind',
    data
  })
}
// 测试收款音响
export function pushMessage (data) {
  return request({
    url: 'api-im/hwPush/pushMessage',
    data
  })
}
// 测试收款音响
export function updateIMInfo (data) {
  return request({
    url: '/api-im/hwBind/updateInfo',
    data
  })
}

/**
 * =========================================================
 *                          店铺开通收款码套餐列表配置
 * ==========================================================
 */

// 套餐列表
export function integralsListPack (data) {
  return request({
    url: '/api-store/store/integrals/listPack',
    data
  })
}
// 店铺角色列表（加自营店）
export function getStoreRoleList () {
  return request({
    url: '/api-store/storeRole/get/list'
  })
}
// 店铺角色列表
export function storeRoleList () {
  return request({
    url: '/api-store/storeRole/list'
  })
}
// 获取所有的店铺角色列表（含自营店）
export function storeAllRoleList () {
  return request({
    url: '/api-store/storeRole/listAdminStoreRole'
  })
}
// 添加店铺套餐
export function integralsAddPack (data) {
  return request({
    url: '/api-store/store/integrals/addPack',
    data
  })
}
// 删除店铺套餐
export function integralsDelPack (data) {
  return request({
    url: '/api-store/store/integrals/delPack',
    data
  })
}
// 修改店铺套餐
export function integralsEditPack (data) {
  return request({
    url: '/api-store/store/integrals/editPack',
    data
  })
}

/**
 * =========================================================
 *                         礼券赠送
 * ==========================================================
 */

// 获取礼券赠送列表
export function getIntegralPushList (data) {
  return request({
    url: '/api-integral/gralV2/getIntegralPushList',
    data
  })
}

// 赠送礼券
export function updateIntegralPushStatus (data) {
  return request({
    url: '/api-integral/gralV2/updateIntegral',
    data
  })
}

/**
 * =========================================================
 *                         商务合作
 * ==========================================================
 */

// 查询商务合作列表
export function getBusinessCooperationList (data) {
  return request({
    url: '/api-store/storeBusinessCooperation/pageList',
    data
  })
}
// 更改商务合作列表状态
export function updateStatus (data) {
  return request({
    url: '/api-store/storeBusinessCooperation/updateStatus',
    data
  })
}

/**
 * =========================================================
 *                         店铺类型折扣
 * ==========================================================
 */

// 获取店铺类型折扣列表
export function getListRate (data) {
  return request({
    url: '/api-store/store/integrals/listRate',
    data
  })
}

// 添加店铺类型折扣
export function addRate (data) {
  return request({
    url: '/api-store/store/integrals/addRate',
    data
  })
}

// 修改店铺类型折扣
export function editRate (data) {
  return request({
    url: '/api-store/store/integrals/editRate',
    data
  })
}
// 删除店铺类型折扣
export function delRate (data) {
  return request({
    url: '/api-store/store/integrals/delRate',
    data
  })
}

// 获取店铺分类
export function getStoreGoodsCateList (data) {
  return request({
    url: '/api-store/storeinfo/storeGoodsCate',
    data: data
  })
}

// 创建自营店
export function addOwnStores (data) {
  return request({
    url: '/api-store/storeinfo/addSelfShop',
    data: data
  })
}

/**
 * =========================================================
 *                         代理商账户相关接口
 * ==========================================================
 */

// 代理商分页列表
export function dlAccountList (data) {
  return request({
    url: '/api-store/dlStatistics/dlCheckDlList',
    data: data
  })
}
// 代理审核 （后台运营）
export function dlCjeckDl (data) {
  return request({
    url: '/api-store/dlStatistics/dlCjeckDl',
    data: data
  })
}
// 注册成为代理商
export function dlRegisterAdd (data) {
  return request({
    url: '/api-store/dlAccount/dlRegister',
    data: data
  })
}
// 根据手机号查询当前用户是否已注册
export function dlRegisterGetUserInfo (data) {
  return request({
    url: '/api-store/dlAccount/getUserInfo',
    data: data
  })
}

/**
 * =========================================================
 *                         环迅商户相关接口
 * ==========================================================
 */

// 查询商户分页列表
export function getIboxMchPageList (data) {
  return request({
    url: '/third-pay/iboxMch/pageList',
    data: data
  })
}
// 同步待审核商户状态
export function syncMchtAudit (data) {
  return request({
    url: '/third-pay/iboxMch/syncMchtAudit',
    data: data
  })
}

// 未配置费率店铺列表
export function storeinfoPageList_v2 (data) {
  return request({
    url: '/api-store/storeinfo/pageList_v2',
    data: data
  })
}
