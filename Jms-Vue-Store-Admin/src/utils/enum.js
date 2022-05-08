/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-09-03 15:31:57
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2021-08-06 15:50:04
 * @FilePath    : \src\utils\enum.js
 * @Description : 前端全局公用枚举字典 集合
 */

/**
 * @description: 枚举对象
 * @param {type} 
 * @return {type} 
 */
import Store from '@/store';
const Dict = {
  // 基础查询对象
  QUERY_PARAMS: {
    keyword: undefined, // 快速查询条件
    pageNum: 1, // 页数
    pageSize: 15, // 大小
    storeId: Store.getters.store ? Store.getters.store.id : undefined,
    direction: undefined, // desc asc
    order: undefined, // 排序字段
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
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "禁用", type: "danger" },
  ],
  // * 状态 是否删除
  STATE: [
    { key: 0, value: "禁用", type: "danger" },
    { key: 1, value: "启用", type: "success" },
  ],
  // * 性别 dict
  GENDER: [
    { key: 0, value: "未知" },
    { key: 1, value: "先生" },
    { key: 2, value: "女士" },
  ],
  // * 商品状态 dict
  STORE_STATUS: [
    { key: 0, value: "正常", type: "success" },
    { key: 1, value: "待审核", type: "default" },
    { key: 2, value: "未通过", type: "danger" },
    { key: 3, value: "禁用", type: "danger" },
  ],
  // * 数字货架商品状态 dict
  CLOUD_STORE_GOODS_STATUS: [
    { key: 0, value: "待陈列", type: "info" },
    { key: 1, value: "已陈列", type: "success" },
    { key: 2, value: "已过期", type: "danger" },
  ],
  // * 积分类型 dict
  INTEGRAL_TYPE: [
    { key: 0, value: "抵扣", type: "info" },
    { key: 1, value: "赠送", type: "default" },
  ],
  // * 商品状态 dict
  GOODS_STATUS: [
    { key: 0, value: "待审核", type: "info" },
    { key: 1, value: "审核中", type: "info" },
    { key: 2, value: "待上架", type: "default" },
    { key: 3, value: "已上架", type: "success" },
    { key: 4, value: "已下架", type: "warning" },
    { key: 5, value: "未通过", type: "danger" },
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
  // * 链接地址类型（1：商品详情，2：进店逛逛，3：网页地址，4：活动栏目）';
  URL_TYPE: [
    { key: 1, value: "商品详情", type: "success" },
    { key: 2, value: "进店逛逛", type: "warning" },
    { key: 3, value: "网页地址", type: "info" },
    { key: 4, value: "活动栏目", type: "danger" },
  ],
  // * 广告图位置（0：首页 1：兑换中心);
  BANNER_TYPE: [
    { key: 'jms_home', value: "首页" },
    { key: 'jms_exchange', value: "兑换中心" },
  ],
  // * 商户业务类型展示
  BUS_TYPE_DICT: [
    { key: "userOrder", value: "商城兑换订单" },
    { key: "storeOrder", value: "商品进货订单" },
    { key: "offlineOrder", value: "线下收款订单" },
    { key: "BS_A008", value: "礼包兑换订单" },
    { key: "BS_A009", value: "本地街市订单" },
  ],
  // * 物流快递delivery
  DELIVERY_DICT: [
    { key: "百世快递", value: "百世快递" },
    { key: "圆通快递", value: "圆通快递" },
    { key: "极兔快递", value: "极兔快递" },
    { key: "韵达快递", value: "韵达快递" },
    { key: "中通快递", value: "中通快递" },
    { key: "申通快递", value: "申通快递" },
    { key: "顺丰快递", value: "顺丰快递" },
    { key: "邮政快递", value: "邮政快递" },
    { key: "京东快递", value: "京东快递" },
    { key: "德邦快递", value: "德邦快递" },
    { key: "速尔快递", value: "速尔快递" },
    { key: "优速快递", value: "优速快递" },
  ]


}

export default Dict;

/**
 * @description: 过滤key返回value
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