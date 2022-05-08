/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 13:46:56
 * @Description  : 请求接口地址管理
 */
'use strict'
// 网站访问页面
const BASE_URL = process.env.VUE_APP_BASE_URL
// 商户注册页面
const STORE_REGISTER_URL = process.env.VUE_APP_STORE_REGISTER_URL
// 本地代理 或 NGINX 配置转发
const WEBSITE_URL = process.env.VUE_APP_WEBSITE_URL

export default {
  WEBSITE_URL,
  STORE_REGISTER_URL,
  // 上传文件
  APP_UPLOAD_IMG: { type: 'multipart', baseUrl: BASE_URL, api: '/api-upload/upload/img' },
  // 登录
  APP_LOGIN: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/login' },
  // 获取用户账号信息
  APP_USER_INFO: { type: 'json', baseUrl: BASE_URL, api: '/api-user/user/get' },
  // 获取店铺
  APP_PHONE: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/getStoreInfoByPhone' },
  // 获取用户账号金额首页
  APP_MONEY: { type: 'json', baseUrl: BASE_URL, api: '/api-money/money/moneyTotal' },
  // 根据账户获取绑定的支付宝账号
  APP_ADD_GET_ALIPAY: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyBindAcct/getAlipayUser' },
  // 绑定支付宝账号
  APP_ADD_BIND_ALIPAY: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyBindAcct/addAlipay' },
  // 绑卡短信签约
  APP_ADD_BINk_ALIPAY: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyBindAcct/signNo' },
  // 绑卡短信签约
  APP_ADD_BINk_DSES: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyBindAcct/sendSms' },
  // 提现短信签约
  APP_ADD_TX_SIGNO: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyDraw/signNo' },
  // 提现短信
  APP_ADD_TX_SES: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyDraw/sendSms' },
  // 提现支付宝
  APP_ADD_TX_ZFB: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyDraw/moneyZfbEmbodyApplyFor' },
  // 提现流水
  APP_ADD_TX_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-money/moneyDraw/pageListByUser' },
  // 提现流水
  APP_ADD_DJ_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-money/money/list' },
  // 修改商户登录密码
  APP_ADD_UPDTA_WDRD: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/updatePassword' },
  // 商户短信签名
  APP_ADD_UPDTA_SMSIGN: { type: 'json', baseUrl: BASE_URL, api: '/api-sms/sms/signNoByType' },
  //  判断用户是否是注册商户
  APP_USER_IS_REGISTER_STORE: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/userIsRegister' },
  //  商户注册发送短信
  APP_COMMON_SMS_SEND: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/send' },
  // 注册短信签名
  APP_REGISTER_STORE_SMS_SIGN: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/smsSign' },
  // 注册
  APP_ADD_UPDTA_SEGIST: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/register' },
  // 跳转注册
  APP_ADD_UPDTA_SEGISTADD: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/add' },
  // 商铺角色
  APP_STORE_ROLE_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeRole/list' },
  // 商铺类别
  APP_ADD_UPDTA_SRORELIST: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeRole/storeCateList' },
  // 创建商铺
  APP_ADD_UPDTA_SROREINFO_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/add' },
  // 根据手机号查询店铺
  APP_ADD_UPDTA_SROREINFO_PHONE: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/getStoreInfoByPhone' },
  // 修改店铺状态 | 审核
  APP_ADD_UPDTA_SROREINFO_AUDIT: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeAdmin/storeInfoAudit' },
  // 修改店铺重新上传
  APP_ADD_UPDTA_SROREINFO_LNFO: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/updateExamineInfo' },
  // 获取店铺详情
  APP_ADD_UPDTA_SROREINFO_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/detail' },
  // 注册验证短信 checkStoreAccountSend
  APP_CHECKSTOREACCOUNTSEND: { type: 'json', baseUrl: BASE_URL, api: '/api-store/account/checkStoreAccountSend' },

  // --------------------------------------商品管理------------------------------
  // 获取店铺商品列表
  APP_STORE_GOODSLIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/storeGoodsList' },
  // 删除商品
  APP_STORE_GOODS_DELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/delete' },
  // 修改商品状态
  APP_STORE_GOODS_UPDATE_STATUS: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/updateStatus' },
  // 修改商品
  APP_STORE_GOODS_UPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/update' },
  // 修改商品详情
  APP_STORE_GOODS_DETAIL_UPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/detailUpdate' },
  // 获取商品基础信息
  APP_STORE_GOODS_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/detail' },
  // 获取商品详情信息
  APP_STORE_GOODS_DETAILINFO: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/detailInfo' },
  // 获取商品SKU列表
  APP_STORE_GOODS_SKULIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/skuList' },
  // 创建商品
  APP_STORE_GOODS_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/add' },
  // 创建商品详情
  APP_STORE_GOODS_DETAIL_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/detailAdd' },
  // 综合操作商品sku
  APP_STORE_GOODS_SKU: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/skuBatchOt' },
  // 复制商品
  APP_STORE_GOODS_COPY: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goods/copyGoods' },
  // 获取商品品牌
  APP_STORE_GOODS_BRAND: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsBrand/list' },

  // 获取商品分类
  APP_STORE_GOODS_CATE_GET: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/storeGoodsCate' },
  // 获取商品相关统计
  APP_STORE_GOODS_COUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/goodsCount' },
  // 获取店铺商品分类列表
  APP_STORE_GOODS_CATEGORY_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoodsBase/getCategoryGoods' },
  // 查询商品分类(便利店基础商品)
  APP_STORE_GOODS_CATEGORY: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/goodsCategory/list' },
  // 获取店铺商品列表(便利店基础商品)
  APP_STORE_GOODS_PAGELIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoodsBase/pageList' },
  // 获取商品sku信息(便利店基础商品)
  APP_STORE_GOODS_BASESKU: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoodsBase/getGoodsBaseSku' },
  // 店铺商品列表
  APP_STORE_GOODS_V2_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoodsList/get_v2' },
  // 店铺商品详情
  APP_STORE_GOODS_V2_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoods/detail' },
  // 店铺商品添加
  APP_STORE_GOODSADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoods/add' },
  // 店铺商品Sku修改
  APP_STORE_GOODS_SKUUPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoodsSku/update' },
  // 店铺商品删除
  APP_STORE_GOODSDELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoods/delete' },
  // 店铺商品状态修改
  APP_STORE_GOODSUPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoods/update' },
  // 店铺商品sku
  APP_STORE_GOODS_SKU_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/storeGoods/storeGoodsSkuList' },

  // --------------------------街市商品-----------
  // 店铺商品列表
  APP_STREET_GOODS_PAGELIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/store/pageList' },
  // 获取商品详情
  APP_STREET_GOODS_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/detail' },
  // 编辑商品
  APP_STREET_GOODS_UPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/update' },
  // 修改街市商品状态
  APP_STREET_GOODS_UPDATE_STATUS: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/updateStatus' },
  // 批量删除街市商品
  APP_STREET_GOODS_DELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/delete' },
  // 本地街市商品添加
  APP_STREET_GOODS_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoods/add' },
  // 获取本地街市类别
  APP_STREET_CATEGORY: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/streetGoodsCategory/list' },

  // ---------------------------------个人中心、店铺相关URL ------------------------
  // 获取店铺信息
  APP_STORE_GET: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/get' },
  // 获取店铺详情
  APP_STORE_DETAIL_GET: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/detail' },
  // 修改店铺信息
  APP_STORE_INFO_UPDATE: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/update' },
  // 获取商户的资产和礼券信息
  APP_TRANSACTIONTOTAL: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/transactionTotal' },
  // 获取礼券明细
  APP_COUPON_DETAILS: { type: 'json', baseUrl: BASE_URL, api: '/api-store/storeinfo/coupon/details' },

  // ---------------------------------订单相关URL ------------------------
  // ----- 商城订单-------------------------------------------------------
  // 获取订单列表信息
  APP_ORDER_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-order/orderV2/listByStore' },
  // 修改待付款订单金额
  APP_ORDERUPDATEAMOUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/orderV2/orderUpdateAmount' },
  // 获取商品订单详情
  APP_ORDER_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/orderV2/detail' },
  // 订单发货
  APP_ORDER_DELIVERY_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-order/delivery/add' },
  // 商品退款订单列表
  APP_ORDER_RETURNAPPLY_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-order/returnApply/listByStore' },
  // 获取申请退款商品订单详情
  APP_ORDER_RETURNAPPLY_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/returnApply/detail' },
  // 确认退款商品订单
  APP_ORDER_RETURNAPPLY_CONFIRM: { type: 'json', baseUrl: BASE_URL, api: '/api-order/v2/refund/confirm' },
  // 拒绝申请退款商品订单
  APP_ORDER_RETURNAPPLY_REJECT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/returnApply/reject' },

  // ---------店铺订单------------------------------------------------------------
  // 根据店铺查询所有订单
  APP_STORE_ORDER_PAGELIST: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/pageListByStore' },
  // 订单统计 （商户通）
  APP_STORE_ORDER_COUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/storeRrderCount' },
  // 根据订单号查询街市订单/店铺订单详情
  APP_STORE_ORDER_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/getStreetOrderByOrderNo' },
  // 修改待付款订单支付金额
  APP_STORE_ORDER_UPDATE_AMOUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/orderUpdateAmount' },
  // 修改街市订单状态
  APP_STORE_ORDER_UPDATE_STATUS: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/orderUpdateStatus' },
  // 确认订单
  APP_STORE_ORDER_CONFIM: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/confirm' },

  // ---------------------------------营销管理相关URL ------------------------
  // 商户通活动获取
  APP_GOODS_GOODSCOMMON: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsActCommon/list' },
  // 获取店铺所有有效的活动套餐列表
  APP_GOODS_STOREPACKLIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsActStorePack/list' },
  // 获取活动套餐列表
  APP_GOODS_ACT_BIND_PACK: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsActBindPack/list' },
  // 根据packCode获取活动套餐
  APP_GOODS_ACT_PACK: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsActPack/get' },
  // 创建购买活动套餐订单
  APP_GOODS_ORDER_ACTPCK: { type: 'json', baseUrl: BASE_URL, api: '/api-order/orderActPck/add' },
  // 购买活动套餐
  APP_GOODS_STORE_BUY_PACK: { type: 'json', baseUrl: BASE_URL, api: '/api-order/orderActPck/storeBuyPack' },
  // admin分页获取活动商品
  APP_GOODS_ACT_LIST: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsAct/pageList' },
  // 批量添加活动商品
  APP_GOODS_ACT_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsAct/add' },
  // 批量删除活动商品
  APP_GOODS_ACT_DELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsAct/delete' },
  // 更改活动商品状态 上架|下架| 审核通过 | 拒绝
  APP_GOODS_ACT_UPDATE_STATUS: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsAct/updateStatus' },
  // 根据店铺查询新品
  APP_GOODS_NEWS: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsNews/getGoodsByStore' },
  // 根据店铺查询推荐商品
  APP_GOODS_RECOMMEND: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsRecommend/getGoodsByStore' },
  // 批量新增推荐商品
  APP_GOODS_RECOMMEND_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsRecommend/add' },
  // 批量新增新品
  APP_GOODS_NEWS_ADD: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsNews/add' },
  // 批量删除推荐商品
  APP_GOODS_RECOMMEND_DELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsRecommend/delete' },
  // 批量删除新品
  APP_GOODS_NEWS_DELETE: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsNews/delete' }
}
