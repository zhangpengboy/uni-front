/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-09-03 15:31:57
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-10-20 20:34:31
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
    pageSize: 15, // 大小
    keyword: undefined, // 快速查询条件
    direction: undefined, // desc asc
    order: undefined, // 排序字段
  },

  // * 高级查询条件sql字段对象
  SQL_QUERY: {
    field: "", // 字段
    operator: "", // 查询类型 =|>|>=|<|<=|<>|between|not between|not like|like|in|not in
    value: "", // 值
  },
  // * 订单状态 dict: 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单; 6->已退款
  ORDERS_STATUS: [
    { key: 0, value: "待付款", type: "info" },
    { key: 1, value: "待发货", type: "default" },
    { key: 2, value: "已发货", type: "info" },
    { key: 3, value: "已完成", type: "success" },
    { key: 4, value: "已关闭", type: "danger" },
    { key: 5, value: "无效订单", type: "danger" },
    { key: 6, value: "已退款", type: "warning" },
    { key: 7, value: "退款中", type: "warning" },
  ],
  // * 物流状态 dict：0->待签收;1->已签收;2->改签中;3->已退款;4->自动签收;
  DELIVERY_STATUS: [
    { key: 0, value: "待签收", type: "default" },
    { key: 1, value: "已签收", type: "success" },
    { key: 2, value: "改签中", type: "warning" },
    { key: 3, value: "已退款", type: "success" },
    { key: 4, value: "自动签收", type: "info" },
  ],
  // * 退款状态 dict：0->待处理；1->退货中；2->已完成；3->已拒绝';
  RETURN_APPLY_STATUS: [
    { key: 0, value: "待处理", type: "default" },
    { key: 1, value: "退货中", type: "warning" },
    { key: 2, value: "已完成", type: "success" },
    { key: 3, value: "拒绝退款", type: "danger" },
  ],
  // * 排序字段 dict
  ORDER: [
    { key: "ascending", value: "ASC" },
    { key: "descending", value: "DESC" }
  ],
  // * 常用字典
  YES_NO: [
    { key: 0, value: "否", type: "danger" },
    { key: 1, value: "是", type: "success" },
  ],
  // * 账户类型
  ACCOUNTYPE: [
    { key: 0, value: "对公", type: "danger" },
    { key: 1, value: "对私", type: "success" },
    { key: 2, value: "非法人", type: "info" },
  ],
  // * 常用字典
  TRUE_FALSE: [
    { key: false, value: "否", type: "danger" },
    { key: true, value: "是", type: "success" },
  ],
  // * 常用字典 是否删除
  STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "禁用", type: "danger" },
  ],
  // * 常用字典 是否已读
  READ_STATUS: [
    { key: 0, value: "未读", type: "info" },
    { key: 1, value: "已读", type: "success" },
  ],
  // * 状态 是否删除
  STATE: [
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
    { key: 0, value: "未知", type: "info" },
    { key: 1, value: "先生", type: "default" },
    { key: 2, value: "女士", type: "success" },
  ],
  // * 代理级别 dict
  AREA_LEVEL: [
    { key: 1, value: "省级代理" },
    { key: 2, value: "市级代理" },
    { key: 3, value: "区级代理" },
    { key: 4, value: "街道代理" },
  ],
  // * 商户账号状态 dict 
  ACCOUNT_STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "禁用", type: "warning" },
    { key: 2, value: "审核中", type: "default" },
    { key: 3, value: "审核拒绝", type: "danger" },
  ],
  // * 环迅商户账号状态 dict 1-待审核 2-审核中 3-审核被拒绝 4-审核通过 5-审核异常
  IBOX_ACCOUNT_STATUS: [
    { key: 0, value: "待审核", type: "default" },
    { key: 1, value: "审核中", type: "warning" },
    { key: 2, value: "审核被拒绝", type: "danger" },
    { key: 3, value: "审核通过", type: "success" },
    { key: 4, value: "审核异常", type: "info" },
  ],
  // * 环迅商户账号状态 licenceType 0-企业法人营业执照1-个体工商户营业执照2-党 政，机关及事业单位3-其他组织
  IBOX_LICENCE_TYPE: [
    { key: 0, value: "企业法人营业执照", type: "default" },
    { key: 1, value: "个体工商户营业执照", type: "warning" },
    { key: 2, value: "党 政，机关及事业单位", type: "danger" },
    { key: 3, value: "小微商户", type: "success" },
  ],
  // * 数字货架商品状态 dict
  CLOUD_STORE_GOODS_STATUS: [
    { key: 0, value: "待陈列", type: "info" },
    { key: 1, value: "已陈列", type: "success" },
    { key: 2, value: "已过期", type: "danger" },
  ],
  // * 数字货架商品状态 dict
  GIFT_MOTHER_STORE_GOODS_STATUS: [
    { key: 0, value: "已下架", type: "info" },
    { key: 1, value: "已上架", type: "success" },
    { key: 2, value: "已过期", type: "danger" },
  ],
  // * 店铺审核状态 dict
  STORE_STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "待审核", type: "info" },
    { key: 2, value: "已拒绝", type: "danger" },
    { key: 3, value: "禁用", type: "danger" },
  ],
  // * 积分类型 dict
  INTEGRAL_TYPE: [
    { key: 0, value: "抵扣", type: "info" },
    { key: 1, value: "赠送", type: "default" },
  ],
  // * 执行状态：0->等待执行；1->执行中；2->执行成功；3->执行失败；4->取消执行
  EXEC_STATUS: [
    { key: 0, value: "等待执行", type: "info" },
    { key: 1, value: "执行中", type: "info" },
    { key: 2, value: "执行成功", type: "success" },
    { key: 3, value: "执行失败", type: "danger" },
    { key: 4, value: "取消执行", type: "default" },
  ],
  // * 商品状态 dict
  GOODS_STATUS: [
    { key: 0, value: "待审核", type: "info" },
    { key: 1, value: "审核中", type: "info" },
    { key: 2, value: "已通过", type: "default" },
    { key: 3, value: "已上架", type: "success" },
    { key: 4, value: "已下架", type: "warning" },
    { key: 5, value: "未通过", type: "danger" },
  ],
  // * 订单状态 dict
  STORE_ORDER_STATUS: [
    { key: 0, value: "待付款", type: "info" },
    { key: 1, value: "待发货", type: "info" },
    { key: 2, value: "已发货", type: "default" },
    { key: 3, value: "已完成", type: "success" },
    { key: 4, value: "已关闭", type: "warning" },
    { key: 5, value: "无效订单", type: "danger" },
    { key: 6, value: "已退款", type: "danger" },
  ],
  // * 状态 dict
  STORE_GOODS_STATUS: [
    { key: 0, value: "禁用", type: "info" },
    { key: 1, value: "启用", type: "success" },
    { key: 2, value: "删除", type: "danger" },
  ],
  // * 活动状态 dict
  ACT_STATUS: [
    { key: 0, value: "未参加活动", type: "info" },
    { key: 1, value: "审核中", type: "info" },
    { key: 2, value: "待上架", type: "default" },
    { key: 3, value: "已上架", type: "success" },
    { key: 4, value: "已下架", type: "warning" },
    { key: 5, value: "未通过", type: "danger" },
  ],
  // * 链接地址类型（1：商品详情，2：进店逛逛，3：网页地址 4：活动栏目）';
  URL_TYPE: [
    { key: 1, value: "商品详情", type: "success" },
    { key: 2, value: "进店逛逛", type: "warning" },
    { key: 3, value: "网页地址", type: "info" },
    { key: 4, value: "活动栏目", type: "danger" },
  ],
  // 活动类型：0->广告图 1->底部栏 2->金刚区 3->活动区 4->列表区
  ACT_TYPE: [
    { key: 1, value: "底部栏" },
    { key: 2, value: "金刚区" },
    { key: 3, value: "活动区" },
    { key: 4, value: "列表区" },
  ],
  // 活动类型展示：0->商品名称+标题+原价+卖价；1->卖价+原价；2->商品名称+卖价；3->只显示商品图片
  ACTShow_Style: [
    { key: 0, value: "商品名称+标题+原价+卖价" },
    { key: 1, value: "卖价+原价" },
    { key: 2, value: "商品名称+卖价" },
    { key: 3, value: "只显示商品图片" },
  ],
  // * -------------------------------促销管理--------------------------------- * //
  // * 促销类型 - dict
  PROMOTE_TYPE: [
    {
      key: 1, value: "特价", children: [
        { key: 1, value: "直接特价" },
        { key: 2, value: "件数特价" },
        { key: 3, value: "偶数特价" }]
    },
    {
      key: 2, value: "折扣", children: [
        { key: 4, value: "直接折" },
        { key: 5, value: "件数折" }]
    },
    {
      key: 3, value: "买满送", children: [
        { key: 6, value: "买满M加N元送商品" },
        { key: 7, value: "买满多少个商品送赠品" }]
    },
    {
      key: 4, value: "买满减", children: [{ key: 8, value: "买满M减N元" }]
    },
  ],
  // 商品角标：0->不显示；1->显示折扣；2->显示直降；3->特卖价
  GOODS_MARK: [
    { key: 0, value: "不显示" },
    { key: 1, value: "显示折扣" },
    { key: 2, value: "显示直降" },
    { key: 3, value: "特卖价" },
  ],
  // 用户角色：1>消费者;2>业务员;3>业务经理;4>合伙人;5>代理商
  ROLECODE: [
    { key: 1, value: "消费者", type: "success" },
    { key: 2, value: "业务员", type: "warning" },
    { key: 3, value: "业务经理", type: "info" },
    { key: 4, value: "合伙人", type: "default" },
    { key: 5, value: "代理商", type: "danger" },
  ],

  // 提现状态：
  MONEY_DRAW_STATUS: [
    { key: 0, value: "待审核", type: "info" },
    { key: 1, value: "提现成功", type: "success" },
    { key: 2, value: "提现失败", type: "warning" },
  ],

  // 结算状态：
  MONEY_SETTLEMENT_STATUS: [
    { key: 0, value: "未结算", type: "info" },
    { key: 1, value: "已结算", type: "success" },
  ],
  // 店东等级homeowner
  MONEY_HOMEOWNER_STATUS: [
    { key: 'S', value: "店东" },
    { key: 'S1', value: "一星店东" },
    { key: 'S2', value: "二星店东" },
    { key: 'S3', value: "三星店东" },
    { key: 'S4', value: "四星店东" },
    { key: 'S5', value: "五星店东" },
  ],
  // 代理等级homeowner
  MONEY_AGENT_STATUS: [
    { key: 'M1', value: "区代理" },
    { key: 'M1-1', value: "一星区代理" },
    { key: 'M1-2', value: "二星区代理" },
    { key: 'M1-3', value: "三星区代理" },
    { key: 'M1-4', value: "四星区代理" },
    { key: 'M1-5', value: "五星区代理" },
  ],
  // 代理等级homeowner
  USER_LEVEL_STATUS: [
    { key: 'P', value: "普通用户" },
    { key: 'P1', value: "初级代理" },
    { key: 'P2', value: "中级代理" },
    { key: 'P3', value: "高级代理" },
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

/**
 * @description: 按钮点击频繁防抖函数
 * @param 
 * @param 
 * @return 
 */
export function stopClick(name = `stopClick`, time = 5000, msg = `请等待1s后再次点击`) {
  let that = this;
  return new Promise((resolve, reject) => {
    if (that[name]) {
      console.log(`${msg} >>>>>>>>>`);
      return false;
    }
    that[name] = true;
    setTimeout(() => {
      that[name] = false;
    }, time);
    resolve();
  });
}