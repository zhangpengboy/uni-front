/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-02 10:19:53
 * @Description : 全局filters
 */
module.exports = {
  // 返回全局积分类型 0：抵扣 1:赠送
  filterIntegralType (key) {
    if (key === 0) return '+'
    return '送'
  },
  filterGoodslType (status) {
    return ['待审核', '待上架', '销售中', '未通过'][status]
  },
  filterGoodsOrderlType (status) {
    return ['待付款', '待发货', '已发货', '退换货'][status]
  },
  filterStoreOrderlType (status) {
    // return ['待付款', '进行中', '已核销', '退换货'][status] // '已完成',
    return ['待付款', '进行中', '已完成', '退换货'][status] // '已完成',
  },
  filterReceivingWay (status) {
    return ['商家配送', '到店自取'][status] // 0-商家配送，1-到店自取
  },
  // 截取手机号
  filterPhone (v) {
    if (v) {
      return v.substr(0, 3) + '****' + v.substr(7)
    }
  }
}
