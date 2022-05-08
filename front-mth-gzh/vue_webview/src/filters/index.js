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
  // 币类型
  filterBitType (type) {
    return [
      '省代',
      '市代',
      '区县代'
    ][type - 1]
  },
  // 充值订单状态
  filterWithdrawStatus (status) {
    return ['审核中', '已完成', '', '', '已取消'][status]
  },
  // 收益发放状态
  filterDlProfitListStatus (status) {
    return ['未发放', '已发放'][status]
  },
  // 充值订单状态
  filterRechargeStatus (status) {
    return ['待付款', '审核中', '已成功', '已失败', '已关闭'][status]
  },
  // 矿机订单支付状态 0->待付款；1->生效；3->已完成；4->已关闭
  filterOrderPayStatus (status) {
    return ['订单待付款', '订单生效中', '', '订单已完成', '订单已关闭'][status]
  },
  // 店铺类型
  filterStoreTypeStatus (status) {
    return ['自营店', 'C店', '供应商店', '便利店-会员店', '联盟商家', '便利店-联盟店'][status]
  },
  // 截取名字
  filterCardName (v) {
    return v.substr(0, 1) + '**'
  },
  // 截取手机号
  filterPhone (v) {
    if (v) {
      return v.substr(0, 3) + '****' + v.substr(7)
    }
  },
  // 截取卡号
  filterCardNo (v) {
    return '****' + v.slice(-4)
  },
  filterAgentText (value) {
    const arr = [
      { value: '', key: 'P' },
      { value: '初级代理', key: 'P1' },
      { value: '中级代理', key: 'P2' },
      { value: '高级代理', key: 'P3' }
    ]
    return _.find(arr, v => {
      return v.key === value
    }).value
  }
  // 图片地址
  // filterBitImg (type) {
  //   return [
  //     require('@/assets/images/center/my-cny@2x.png'),
  //     require('@/assets/images/center/my-btc@2x.png'),
  //     require('@/assets/images/center/my-eth@2x.png'),
  //     require('@/assets/images/center/my-fil@2x.png'),
  //     require('@/assets/images/center/XCH@2x.png'),
  //     require('@/assets/images/center/my-usdt@2x.png')
  //   ][type - 1]
  // }
}
