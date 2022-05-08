/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-09-03 15:31:57
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-04-30 15:38:20
 * @FilePath    : \src\utils\enum.js
 * @Description : 前端全局公用枚举字典 集合
 */

/**
 * @description: 枚举对象
 * @param {type} 
 * @return {type} 
 */
const Dict = {

  // 基础查询对象
  QUERY_PARAMS: {
    pageNum: 1, // 页数
    pageSize: 20, // 大小
    keyword: undefined, // 快速查询条件
    direction: undefined, // desc asc
    order: undefined, // 排序字段
    status: undefined, // 状态
    bitType: undefined, // 类型 1-CNY 2-BTC 3->ETH
    drawType: undefined,
    roleName: undefined
  },

  // * 高级查询条件sql字段对象
  SQL_QUERY: {
    field: "", // 字段
    operator: "", // 查询类型 =|>|>=|<|<=|<>|between|not between|not like|like|in|not in
    value: "", // 值
  },

  // * 排序字段 dict
  ORDER: [
    { key: "ascending", value: "ASC" },
    { key: "descending", value: "DESC" }
  ],
  // * 常用字典
  YES_NO: [
    { key: 1, value: "是" },
    { key: 0, value: "否" },
  ],
  // * 常用字典 是否删除
  STATUS: [
    { key: 0, value: "禁用", type: "danger" },
    { key: 1, value: "启用", type: "success" },
  ],
  // * 权重规则
  WEIGHT_RULES: [
    { key: 1, value: "金额+积分", type: "success" },
    { key: 2, value: "金额", type: "warning" },
    { key: 3, value: "积分", type: "info" },
  ],
  // * 性别 dict
  GENDER: [
    { key: 0, value: "未知" },
    { key: 1, value: "先生" },
    { key: 2, value: "女士" },
  ],
  // * 挖矿分发订单状态
  DIG_BIT_STATUS: [
    { key: 0, value: "未分发", type: "default" },
    { key: 1, value: "已分发", type: "success" },
  ],
  // * 商户账号状态 dict
  ACCOUNT_STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "禁用", type: "warning" },
    { key: 2, value: "审核中", type: "default" },
    { key: 3, value: "审核拒绝", type: "danger" },
  ],
  // * 店铺审核状态 dict
  STORE_STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "待审核", type: "info" },
    { key: 2, value: "已拒绝", type: "danger" },
  ],
  // * 积分类型 dict
  INTEGRAL_TYPE: [
    { key: 0, value: "抵扣", type: "info" },
    { key: 1, value: "赠送", type: "default" },
  ],
  // * 商品状态 dict 0->待审核；1->审核中；2->待上架；3->已上架；4->已下架；5->未通过；6->删除'
  GOODS_STATUS: [
    { key: 0, value: "待审核", type: "info" },
    { key: 1, value: "审核中", type: "info" },
    { key: 2, value: "待上架", type: "default" },
    { key: 3, value: "已上架", type: "success" },
    { key: 4, value: "已下架", type: "warning" },
    { key: 5, value: "未通过", type: "danger" },
  ],
  // * 币种类型 dict
  BIT_TYPE: [
    { key: 0, value: "未知", type: "default" },
    { key: 1, value: "CNY", type: "primary" },
    { key: 2, value: "BTC", type: "success" },
    { key: 3, value: "ETH", type: "warning" },
    { key: 4, value: "FIL", type: "info" },
    { key: 5, value: "XCH", type: "default" },
    { key: 6, value: "USDT", type: "primary" },
  ],
  // * 资产类型 dict
  BIT_TYPE_LIST: [
    { key: 0, value: "未知", type: "default" },
    { key: 1, value: "CNY", type: "primary" },
    { key: 2, value: "BTC", type: "success" },
    { key: 3, value: "ETH", type: "warning" },
    { key: 4, value: "未知", type: "danger" },
    { key: 5, value: "未知", type: "danger" },
    { key: 6, value: "未知", type: "danger" },
  ],
  // * 充值状态 dict
  RECHARGE_STATUS: [
    { key: 0, value: "待付款", type: "default" },
    { key: 1, value: "待审核", type: "info" },
    { key: 2, value: "已成功", type: "success" },
    { key: 3, value: "已失败", type: "danger" },
    { key: 4, value: "已关闭", type: "warning" },
  ],
  // * 提现状态 dict
  WITHDRAW_STATUS: [
    { key: 0, value: "待审核", type: "info" },
    { key: 1, value: "已成功", type: "success" },
    { key: 2, value: "未  知", type: "success" },
    { key: 3, value: "未  知", type: "success" },
    { key: 4, value: "已拒绝", type: "danger" },
  ],
  // * 产品类型 dict
  MACHINE_TYPE: [
    { key: 1, value: "CNY", type: "primary" },
    { key: 2, value: "BTC", type: "success" },
    { key: 3, value: "ETH", type: "danger" },
  ],

  /** 业务类型 0->充值；1->提现；2->挖矿收益；3->邀请返佣；4->邀请收益分成；5->兑换产品；6->退款；7->提现手续费'*/
  BUS_TYPE: [
    { key: 0, value: "充值" },
    { key: 1, value: "提现" },
    { key: 2, value: "挖矿收益" },
    { key: 3, value: "邀请返佣" },
    { key: 4, value: "邀请收益分成" },
    { key: 5, value: "兑换产品" },
    { key: 6, value: "退款" },
    { key: 7, value: "提现手续费" },
  ],
  /** 资金状态 */
  MONEY_STATUS: [
    { key: 0, value: "转出", type: "danger" },
    { key: 1, value: "转入", type: "success" },
  ],
  /** 挖矿类型 */
  DIG_TYPE_ENUM: [
    { key: 1, value: "联合挖矿", list: [{ key: 1, value: "比特币矿机" },{ key: 2, value: "以太币矿机" }] },
    { key: 2, value: "算力专区", list: [{ key: 3, value: "BTC算力" },{ key: 4, value: "ETH算力" }]  },
    { key: 3, value: "储存挖矿", list: [{ key: 5, value: "IPFS矿机" },{ key: 6, value: "CHIA矿机" }]  },
  ],
  /** 矿机类型 */
  MACHINE_TYPE_ENUM: [
    { key: 1, value: "比特币矿机" },
    { key: 2, value: "以太币矿机" },
    { key: 3, value: "BTC算力" },
    { key: 4, value: "ETH算力" },
    { key: 5, value: "IPFS矿机" },
    { key: 6, value: "CHIA矿机" },
  ],
  /** 产出类型 */
  BIT_TYPE_ENUM: [
    { key: 2, value: "BTC" },
    { key: 3, value: "ETH" },
    { key: 4, value: "FIL" },
    { key: 5, value: "XCH" },
  ],
  /** 手续费编号枚举 */
  FEI_NO_ENUM: [
    { key: "draw", value: "提现" },
  ],
  /** 手续费类型 */
  FEI_TYPE_ENUM: [
    { key: 1, value: "百分比" },
    { key: 2, value: "固定金额" },
  ],
  /** 提现类型 */
  DRAW_TYPE_ENUM: [
    { key: 1, value: "用户提现" },
    { key: 2, value: "代理提现" },
  ],
  /** 代理角色类型 */
  DRAW_ROLE_TYPE_ENUM: [
    { key: 1, value: "初级代理" },
    { key: 2, value: "中级代理" },
    { key: 3, value: "高级代理" },
    { key: 4, value: "合伙人" },
  ],

}

export default Dict;

/**
 * @description: 过滤key返回value或图标
 * @param {key} 值
 * @param {dist} 字典字符串
 * @return {string} value
 */
export function filterKeyToValue(key, dict) {
  const targetEnum = Dict[dict];
  if (!_.isArray(targetEnum)) return key;
  const targetObj = _.find(targetEnum, v => v.key == key);
  return _.get(targetObj, "value", "");
}
