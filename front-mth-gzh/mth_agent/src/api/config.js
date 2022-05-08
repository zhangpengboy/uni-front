/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 13:46:56
 * @Description  : 后台请求接口地址管理
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

  // 注册短信签名
  APP_REGIST_SMS_SGIN: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/registSmsSign'
  },

  // 通用发送短信
  APP_COMMON_SEND_MSG: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-user/user/registSmsSend'
  },

  // 注册
  APP_REGIST: { type: 'json', baseUrl: BASE_URL, api: '/api-user/user/regist' },

  // 注册成为代理商
  APP_DLACCOUNT_REGISTER: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlAccount/dlRegister'
  },
  // 根据手机号查询当前用户是否已注册
  APP_DLACCOUNT_USERINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlAccount/getUserInfo'
  },
  // 当前用户是否为代理 true -> 代理，false -> 不是代理
  APP_ISDLACCOUNT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlIsUserDl'
  },
  // 辖区统计
  APP_DLSTATISTICS: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlRegister'
  },
  // 代理信息
  APP_DLUSERACCOUNT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlUserAccount'
  },
  // 角色切换
  APP_DLCUT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlCut'
  },
  // 申请代理
  APP_DLAPPLYFORDL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlApplyforDl'
  },
  // 我的收益
  APP_INCOMEDETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/incomeDetail'
  },
  // 市级代理列表
  APP_INCOMEDETAIL_CITY: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlCityDetails'
  },
  // 区级代理列表
  APP_INCOMEDETAIL_DISTRICT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlDistrictDetails'
  },
  // 店铺、数字货架、礼券妈妈列表
  APP_INCOMEDETAIL_STORE: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlStoreDetails'
  },
  // 辖区内单个代理商的信息
  APP_REGISTER_DLUSERINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/registerDlUserInfo'
  },
  // 辖区内单个店铺信息
  APP_REGISTER_DLSTOREINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/registerDlStoreInfo'
  },
  // 代理收益流水列表
  APP_INCOMEDETAIL_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-store/dlStatistics/dlProfitList'
  },

  // --------------------------------------商户进件--------------------------------------
  // 商户注册
  APP_IBOXPAY_MCHREGISTER: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/mchRegister'
  },
  // 文件上传
  APP_IBOXPAY_FILEUPLOAD: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/fileUpload'
  },
  // 获取商户经营范围
  APP_IBOXPAY_STORECATELIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/storeCateList'
  },
  // 根据名称模糊查询支行信息
  APP_IBOXPAY_QUERY_BRANCHBANK: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/queryBranchBank'
  },
  // 查询店铺进件资料
  APP_IBOXPAY_DETAIL: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxMch/detail'
  },
  // 查询商户审核状态
  APP_IBOXPAY_QUERYMCHTAUDIT: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/queryMchtAudit'
  },
  // 注册分账账户
  APP_IBOXPAY_MCHLEDGERREGISTER: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/mchLedgerRegister'
  },
  // 影印件上传
  APP_IBOXPAY_MCHUPLOADPIC: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/third-pay/iboxPay/mchUploadPic'
  },

  // -----------------------------------我的团队----------------------
  // 获取当前用户等级和邀请人数，会员人数
  APP_USERREKATUIBINFO: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relTree/userRekatuibInfo'
  },
  // 间邀列表
  APP_INVITATION_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relTree/invitationList'
  },
  // 直邀列表
  APP_DIRECT_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relTree/directInvitationList'
  },
  // 团队列表
  APP_DIRECT_TEAM_LIST: {
    type: 'json',
    baseUrl: BASE_URL,
    api: '/api-relation/relTree/getTeamList'
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

  // 获取分账记录
  APP_GET_PLAN_LIST: { type: 'json', baseUrl: BASE_URL, api: '/money-sharing/plan/pageList' }
}
