/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 13:46:56
 * @Description  : 请求接口地址管理
 */
'use strict'

// 本地代理 或 NGINX 配置转发
const BASE_URL = process.env.VUE_APP_BASE_URL
const WEBSITE_URL = process.env.VUE_APP_WEBSITE_URL

export default {
  WEBSITE_URL,
  // 上传文件
  APP_UPLOAD_IMG: {
    type: 'multipart',
    baseUrl: BASE_URL,
    api: '/api-upload/upload/img'
  },
  // 获取H5站点的地址
  APP_SITE_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: 'api-superadmin/appSite/list'
  },

  // 微信授权登录
  APP_WECHAT_AUTH: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/wxLogin'
  },
  // 公众号登陆获取Code
  APP_MALLUSER_AUTH: {
    type: 'formData',
    baseUrl: BASE_URL,
    api: '/api-user/user/auth'
  },
  // 公众号登陆获取用户信息
  APP_MALLUSER_INFO: {
    type: 'formData',
    baseUrl: BASE_URL,
    api: '/api-user/user/gzhUserInfo'
  },
  // 用户注册短信签约
  APP_REGISTSMSSIGN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/registSmsSign'
  },
  // 用户短信发送
  APP_REGISTSMS_SEND: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/registSmsSend'
  },
  // 授权登陆后绑定手机号码 --> 通用方法
  APP_BINDINGPHONE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/bindingPhone'
  },
  // 模糊搜索
  APP_NAMELIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/nameGoodsList'
  },
  // 账号密码登录 /api-user/user/login
  APP_MALLUSER_LOGIN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: 'api-user/user/login'
  },

  /**
   * ====================================================================================================
   *                          my 我的 页面相关接口
   * ====================================================================================================
   */
  // 获取用户积分、资金、邀请码信息
  APP_MALLUSER_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/userinfo'
  },
  // 获取用户关注的店铺信息
  APP_USERFAVORSTORE_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/pageListStore'
  },
  // 获取用户的邀请码信息
  APP_WXBARCODEIMG_GET: {
    // url: 'https://test.lanceyi.com',
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relTree/wxBarCodeImg'
  },
  // 获取用户的收藏列表信息
  APP_USERFAVORGOODS_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/listGoods'
  },
  // 获取当前用户是否收藏商品
  APP_USERFAVORGOODS_YES_NO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: 'api-user/userFavor/getGoods'
  },
  // 取消用户的收藏
  // APP_USERFAVORGOODS_DEL: {
  //   type: 'json',
  //   baseUrl: BASE_URL,
  //   api: '/api-user/userFavor/delGoods'
  // },
  // 修改用户的信息
  APP_USEREDITINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/userEditInfo'
  },
  // 获取用户资金总数（资产信息）
  APP_USERMONEYINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/money/moneyTotal'
  },
  // 获取用户资金流水
  APP_USERMONEYLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/money/list'
  },
  // 获取用户积分信息 （获取积分冻结明细）
  APP_USERINTEGRAL_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-integral/gralV2/get'
  },
  // 获取用户积分列表信息
  APP_USERINTEGRALLIST_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-integral/gralV2/getIntegralListById'
  },
  // 获取用户信息列表（365vip字段）
  APP_USERPAGELIST_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/getUserPageList'
  },
  // ---------------------------- 我的服务-----------------------------------------
  APP_STOREINFOPHONE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/getStoreInfoByPhone'
  },
  // 获取数字货架支付金额
  APP_GETMONEY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/getMoney'
  },
  // 创建充值订单
  APP_DEPOSITADD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/depositOrder/add'
  },
  // 创建充值订单
  APP_DEPOSITADD_TOW: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/depositOrder/add_v2'
  },

  // ---------------------------- 订单业务-----------------------------------------
  // 获取用户订单列表
  APP_USERORDERLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/listByUser'
  },
  // 获取用户商品订单详情
  APP_USERORDERDETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/detail'
  },
  // 取消订单
  APP_USERORDERCANCEL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/cancel'
  },
  // 删除订单
  APP_ORDER_DELETE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/orderDelete'
  },
  // 确认收货
  APP_USERORDERCONFIRM: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/confirm'
  },
  // 申请退款
  APP_RETURNAPPLY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/returnApply/add'
  },
  // 获取退款申请信息
  APP_RETURNAPPLYDETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/returnApply/detail'
  },

  // ---------------------------- 收货地址-----------------------------------------
  // 获取地址列表
  APP_ADDRESSLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/list'
  },
  // 获取地址详情
  APP_ADDRESSDETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/detail'
  },
  // 修改地址
  APP_ADDRESS_UPDATE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/update'
  },
  // 添加地址
  APP_ADDRESS_ADD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/add'
  },
  // 删除地址
  APP_ADDRESS_DEL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/delete'
  },
  // 轮播图
  APP_LBTLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsActAdvertise/list'
  },
  // 获取首页活动列表
  APP_ACTLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsActCommon/getHomeActList'
  },
  // 获取商品基本地址
  APP_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/detail'
  },
  // 获取王牌列表
  APP_GOODSLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/getHomeGoodsList'
  },
  // 获取王牌地址
  APP_TOWNLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsActCommon/getHometownList'
  },
  // 获取王牌轮播图图片
  APP_MIDLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsActAdvertise/mid_list'
  },
  // 获取l列表
  APP_LISTMALL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsAct/pageListMall'
  },

  // 获取活动
  APP_BYTYPE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsActCommon/getActListByType'
  },
  // 获取商品详情
  APP_DATELNFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/detailInfo'
  },
  // 获取商品基础详情
  APP_DATEL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/detail'
  },

  // 获取商品sku
  APP_SKULIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/skuList'
  },
  // 店铺是否关注
  APP_FOANDFAVOR: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/getStoreInfoAndFavor'
  },
  // 获取店铺信息
  APP_STOREINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/get_v2'
  },
  // 关注店铺
  APP_ADDSTORE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/addStore'
  },
  // 取消关注店铺
  APP_DELSTORE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/delStore'
  },
  // 推荐
  APP_RECOMMEND: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsRecommend/getGoodsByStore'
  },
  // 新品
  APP_RECOMNEWS: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goodsNews/getGoodsByStore'
  },
  // 活动
  APP_RECOMTEB: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/getGoodsActivityInverted'
  },
  // 宝贝
  APP_RECOMLUVETEB: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/getGoodsInverted'
  },

  // 删除商品收藏
  APP_FAVORDEL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/delGoods'
  },
  // 添加商品收藏
  APP_FAVORADD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userFavor/addGoods'
  },
  // 精品全部商品
  APP_PAGELIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/getShopAllGoodsPageList'
  },
  // 获取用户地址
  APP_ADDRESS: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/address/list'
  },
  // 支付页面
  APP_ORDERV: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/orderV2/add'
  },
  // 获取用户积分
  APP_GRALGET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-integral/gralV2/get'
  },
  // 支付
  APP_PAYADD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-pay/pay/add'
  },
  // 模糊搜索
  APP_NAMEGOODSLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/nameGoodsList'
  },
  // 查看云店推送商品列表
  APP_STOREPAGELIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/cloudStore/pageList'
  },
  // 获取业务员数数字货架是否需要支付状态
  APP_SHELVES: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/getDigitalShelves'
  },
  // 修改数字货架支付状态
  APP_UPDATESHELVES: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/updateDigitalShelves'
  },
  // 获取用户信息
  APP_USERGET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/get'
  },

  // 查询商品分润配置
  APP_MECONFIG: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/goods/getGoodsIncomeConfig'
  },
  // 查看使用和未使用和过期的礼包卷
  APP_GETGIFTUSE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/getGiftUse'
  },

  // 根据手机号获取礼券妈妈开通信息
  APP_GIFTMOTHER_BYPHONE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeGiftMother/getByPhone'
  },
  // 根据手机号是否开通礼券妈妈
  APP_GIFTMOTHER_HASOPEN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeGiftMother/hasOpen'
  },
  // 获取礼券妈妈开通支付金额
  APP_GIFTMOTHER_MONEY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeGiftMother/payMoney'
  },

  // 分页查看礼券妈妈商品列表（根据条件查询，具体看入参实体）
  APP_GIFTMOTHER_GOODSLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/giftMother/pushGoodsList'
  },

  // 根据店铺查询礼券妈妈商品信息
  APP_GIFTMOTHER_GOODS: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/giftMother/getGoodsByStoreId'
  },

  // 获取礼券妈妈分润配置详情
  APP_INCOMEGIFTMOTHER_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/incomeGiftMother/detail'
  },

  // 礼券妈妈C店注册
  APP_GIFTMOTHER_CREATE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/createGiftMother'
  },

  // 根据店铺角色获取店铺类目、
  APP_STORECATELIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeRole/storeCateList'
  },
  // 返回是否开通365礼包 true=开通
  APP_GETGIFTBUY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/getIsBuyGift'
  },
  // 开通365礼券
  APP_NOTIFY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/userPay/notify'
  },
  // 获取礼包总配置列表
  APP_PAGELISTFIG: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/giftConfig/pageList'
  },
  // 返回当前时间所属的礼券福袋
  APP_GIFT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/gift'
  },

  // 获取当前登录用户顶层的关系人信息
  APP_GETTOPUSER: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relation/getTopUser'
  },
  // 根据code反查地址
  APP_STOREAREA: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeArea/get'
  },
  // 根据区域ID获取下级分类
  APP_STOREAREA_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeArea/list'
  },
  // 是否签到
  APP_ISUSERSIGN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/isUserSign'
  },
  // 是否第一次签到
  APP_ISFIRSTIMESIGN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/gift/userGiftSign'
  },
  // 获取用户账号信息
  APP_USER_INFO: { type: 'json', baseUrl: BASE_URL, api: '/api-user/user/get' },
  // 获取店铺
  APP_PHONE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/getStoreInfoByPhone'
  },
  // 获取用户账号金额首页
  APP_MONEY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/money/moneyTotal'
  },
  // 根据账户获取绑定的支付宝账号
  APP_ADD_GET_ALIPAY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyBindAcct/getAlipayUser'
  },
  // 绑定支付宝账号
  APP_ADD_BIND_ALIPAY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyBindAcct/addAlipay'
  },
  // 绑卡短信签约
  APP_ADD_BINk_ALIPAY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyBindAcct/signNo'
  },
  // 绑卡短信签约
  APP_ADD_BINk_DSES: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyBindAcct/sendSms'
  },
  // 提现短信签约
  APP_ADD_TX_SIGNO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyDraw/signNo'
  },
  // 提现短信
  APP_ADD_TX_SES: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyDraw/sendSms'
  },
  // 提现支付宝
  APP_ADD_TX_ZFB: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyDraw/moneyZfbEmbodyApplyFor'
  },
  // 提现流水
  APP_ADD_TX_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/moneyDraw/pageListByUser'
  },
  // 提现流水
  APP_ADD_DJ_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-money/money/list'
  },
  // 修改商户登录密码
  APP_ADD_UPDTA_WDRD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/account/updatePassword'
  },
  //  商户注册发送短信
  APP_COMMON_SMS_SEND: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-sms/sms/send'
  },
  // 商户短信签名
  APP_ADD_UPDTA_SMSIGN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-sms/sms/signNoByType'
  },
  // 获取公众号分享签名
  APP_ADD_UPDTA_HESIGN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/getOfficialAccountsShareSign'
  },

  // 查询当前用户是否是代理商
  APP_DLACCOUNT_ISDL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlIsUserDl'
  },
  // 当前账户的代理商是否在审核状态
  APP_DLACCOUNT_DLSTATUS: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlStatus'
  },
  // 获取积分锁仓
  APP_ADD_UPDTA_LOCKLIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-integral/gralV2/lockList'
  },
  // 根据用户获取积分冻结明细
  APP_STORE_ROLE_LISTBYID: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-integral/gralV2/getFrozenIntegralListById'
  },
  // 根据用户id获取绑定关系列表
  APP_ADD_UPDTA_BYUSER: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relation/pageListByUser'
  },
  // 根据手机号绑定上下级关系
  APP_ADD_UPDTA_BYPHONE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relation/bindRelationByPhone'
  },
  // 根据uuid查询云创业商品的代卖信息
  APP_GOODS_BY_UUID: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/giftMother/getGoodsByUuid'
  },
  // 根据uuid查询云创业商品的代卖信息
  APP_CLOUDSTOREGOODS_BY_UUID: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/cloudStore/getGoodsByUuid'
  },
  // 根据code反查地址
  APP_STOREAREA_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeArea/get'
  },
  // 根据坐标查询详细定位
  APP_STORELOCATION_INFO_GET: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeArea/getLocationInfo'
  },
  // 根据坐标查询详细定位
  APP_STORE_INFO_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/storeinfo/detail'
  },
  // // 店铺商品列表
  APP_STORE_GOODS_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-goods/storeGoods/storeGoodsList'
  },
  // // 创建订单
  APP_STORE_ORDER_ADD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/streetOrder/add'
  },
  // 根据订单号查询订单
  APP_STORE_ORDER_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-order/streetOrder/getStreetOrderByOrderNo'
  },
  // ---------店铺订单------------------------------------------------------------
  // 根据用户查询所有订单
  APP_STORE_ORDER_PAGELIST: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/pageListByUser' },
  // 订单统计 （商户通）
  APP_STORE_ORDER_COUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/storeRrderCount' },
  // 根据订单号查询街市订单/店铺订单详情
  // APP_STORE_ORDER_DETAIL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/getStreetOrderByOrderNo' },
  // 修改待付款订单支付金额
  APP_STORE_ORDER_UPDATE_AMOUNT: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/orderUpdateAmount' },
  // 修改街市订单状态
  APP_STORE_ORDER_UPDATE_STATUS: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/orderUpdateStatus' },
  // 删除订单
  APP_STORE_ORDER_DEL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/delete' },
  // 取消订单
  APP_STORE_ORDER_CANCEL: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/cancel' },
  // 确认订单
  APP_STORE_ORDER_CONFIM: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/confirm' },
  // 订单核销
  APP_STORE_ORDER_VERIFICATION: { type: 'json', baseUrl: BASE_URL, api: '/api-order/streetOrder/orderVerification' },

  // mall分页获取活动商品V2
  APP_GOODSACT_PAGELISTMALL_V2: { type: 'json', baseUrl: BASE_URL, api: '/api-goods/goodsAct/pageListMall/v2' }

  //

}
