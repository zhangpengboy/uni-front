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
  // 截取卡号
  filterCardNo (v) {
    return '****' + v.slice(-4)
  },
  // 过滤性别
  filterSex (status) {
    return ['保密', '男', '女'][status]
  },
  // 截取手机号
  filterPhone (v) {
    if (v) {
      return v.substr(0, 3) + '****' + v.substr(7)
    }
  },
  filterReceivingWay (status) {
    return ['商家配送', '到店自取'][status] // 0-商家配送，1-到店自取
  }
}
