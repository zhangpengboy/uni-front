/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-30 13:46:56
 * @Description  : 后台请求接口地址管理
 */
"use strict";

// 本地代理 或 NGINX 配置转发
const BASE_URL = process.env.VUE_APP_BASE_URL;
const WEBSITE_URL = process.env.VUE_APP_WEBSITE_URL;

export default {
  WEBSITE_URL,
  // 上传文件
  APP_UPLOAD_IMG: {
    type: "multipart",
    baseUrl: BASE_URL,
    api: "/api-upload/upload/img",
  },

  // 登录
  APP_LOGIN: { type: "json", baseUrl: BASE_URL, api: "/api-user/user/login" },
  // 获取用户账号信息
  // APP_USER_INFO: { type: "json", baseUrl: BASE_URL, api: "/api-user/user/get" },
  // 获取用户邀请码
  APP_USER_INVITE_CODE: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/get",
  },
  // 获取当前用户社交信息
  APP_USER_INFO: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/detail",
  },
  // 获取资产信息
  APP_AGENTMONEY_INFO: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/agentMoney/get",
  },
  // 获取资产历史记录
  APP_AGENTMONEY_LIST: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/agentMoney/list",
  },
  // 代理商提现到钱包
  APP_AGENTMONEY_DRAW: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/agentMoney/agentDraw",
  },
  // 代理提现记录列表
  APP_AGENTMONEY_DRAWLIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-relation/agentMoney/drawList",
  },

  // 分页获取直邀用户列表
  APP_RELATION_LIST: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/list",
  },
  // 分页获取团队成员列表
  APP_RELATION_USERLIST: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/userList",
  },

  // 绑定团队长
  APP_RELATION_BINDGROUP: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/bindGroup",
  },

  // 查询团队长
  APP_RELATION_GETGROUP: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-relation/relation/getGroup",
  },

  // 注册
  APP_REGIST: { type: "json", baseUrl: BASE_URL, api: "/api-user/user/regist" },
  // 找回密码
  APP_FORGET_PWD: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/user/forgetPwd",
  },
  // 重置支付密码
  APP_RESET_PAY_PWD: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/user/resetPayPwd",
  },
  // 注册短信签名
  APP_REGIST_SMS_SGIN: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/sms/registSmsSign",
  },
  // 找回密码短信签名
  APP_FORGET_PWD_SMS_SGIN: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/sms/forgetPwdSmsSign",
  },
  // 重置支付密码短信签名
  APP_RESET_PAY_PWD_SMS_SGIN: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/sms/resetPwdSmsSign",
  },
  // 通用短信签名
  APP_COMMON_SIGN_NO: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/sms/smsSign",
  },
  // 通用发送短信
  APP_COMMON_SEND_MSG: {
    type: "json",
    baseUrl: BASE_URL,
    api: "/api-user/sms/send",
  },

  // 获取资产
  APP_ASSETS_GET: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/assert/get",
  },
  // 获取资产记录列表
  APP_ASSETS_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/assert/list",
  },
  // 获取提现手续费列表
  APP_ASSETS_GET_FEI: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/assert/getFei",
  },

  // 创建充值订单
  APP_RECHARGE_ORDER_ADD: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/recharge/add",
  },
  // 充值订单详情
  APP_RECHARGE_ORDER_INFO: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/recharge/detail",
  },
  // 充值订单列表
  APP_RECHARGE_ORDER_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/recharge/list",
  },
  // 完成订单充值
  APP_RECHARGE_FINISHED: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/recharge/finished",
  },

  // 获取公司对公账号
  APP_COMPANY_CARD_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/compCardList",
  },
  // 获取用户绑定的银行卡列表
  APP_BIT_CARD_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/list",
  },
  // 绑定银行卡
  APP_BIT_CARD_ADD: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/add",
  },
  // 绑卡发送短信签名
  APP_CARD_SMS_SIGN: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/smsSign",
  },
  // 添加钱包地址
  APP_CARD_WALLET_ADD: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/addWallet",
  },
  // 获取钱包地址列表
  APP_CARD_WALLET_GET: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/card/getWallet",
  },

  // 申请提现
  APP_WITHDRAW_ORDER_ADD: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/draw/add",
  },
  // 提现发送签名
  APP_WITHDRAW_SMS_SIGN: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/draw/smsSign",
  },
  // 提现订单详情
  APP_WITHDRAW_ORDER_INFO: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/draw/detail",
  },
  // 提现订单列表
  APP_WITHDRAW_ORDER_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/draw/list",
  },
  // 获取最小提现额度
  APP_WITHDRAW_MIN: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/draw/drawMin",
  },

  // 产品列表
  APP_PRODUCT_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/product/list",
  },
  // 产品基础信息
  APP_PRODUCT_GET: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/product/get",
  },
  // 产品详细信息
  APP_PRODUCT_INFO: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/product/detail",
  },
  // 产品详细信息
  APP_PRODUCT_PACK_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/product/listPack",
  },

  // 创建矿机订单
  APP_PORDER_ADD: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/pOrder/add",
  },
  // 矿机订单列表
  APP_PORDER_LIST: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/pOrder/list",
  },
  // 矿机订单详情
  APP_PORDER_INFO: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/pOrder/detail",
  },
  // 下单短信签约
  APP_PORDER_SEND_SIGN: {
    type: "formData",
    baseUrl: BASE_URL,
    api: "/api-bit/pOrder/buySmsSign",
  },
};
