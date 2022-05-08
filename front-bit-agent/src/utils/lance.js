/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 16:13:23
 * @Description  : 全局通用方法
 */

const prefix = "jjs-bit-";

module.exports = {
  // 获取积分文字
  getIntegralName() {
    return "礼券";
  },
  // 获取TokenHead
  getTokenHead() {
    return "Bearer ";
  },
  // 设置String: JSON数据缓存
  setJson(key, value) {
    let jsonString = JSON.stringify(value);
    window.localStorage.setItem(prefix + key, jsonString);
  },
  // 获取JSON数据
  getJson(key) {
    const value = window.localStorage.getItem(prefix + key);
    if (value) return JSON.parse(value);
  },
  // 设置String: String数据缓存
  setData(key, value) {
    window.localStorage.setItem(prefix + key, value);
  },
  // 获取String数据
  getData(key) {
    const value = window.localStorage.getItem(prefix + key);
    if (value) return value;
  },
  // 清除指定Key数据
  clearStorage(key) {
    window.localStorage.removeItem(prefix + key);
  },
  // 参数串化
  stringify(obj, prefix) {
    let pairs = [];
    for (let key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      let value = obj[key];
      let enkey = encodeURIComponent(key);
      let pair;
      if (typeof value === "object") {
        pair = this.stringify(
          value,
          prefix ? prefix + "[" + enkey + "]" : enkey
        );
      } else {
        pair =
          (prefix ? prefix + "[" + enkey + "]" : enkey) +
          "=" +
          encodeURIComponent(value);
      }
      pairs.push(pair);
    }
    return pairs.join("&");
  },
  // 参数对象化
  parse(query) {
    let result = {};
    let part = null;
    let parser = /([^=?#&]+)=?([^&]*)/g;
    // eslint-disable-next-line no-cond-assign
    while ((part = parser.exec(query))) {
      let key = decodeURIComponent(part.replace(/\+/g, " ")) || null;
      let value = decodeURIComponent(query[part].replace(/\+/g, " ")) || null;
      if (key === null || value === null || key in result) continue;
      result[key] = value;
    }
    return result;
  },
  // 时间格式化
  parseTime(time, cFormat) {
    if (arguments.length === 0) return null;
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
      date = time;
    } else {
      if (typeof time === "string" && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      }
      if (typeof time === "number" && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || 0;
    });
    return timeStr;
  },
  // 返回全局积分类型 0：抵扣 1:赠送
  filterIntegralType(key) {
    if (key === 0) return "+";
    return "送";
  },
  // 币类型
  filterBitType(type) {
    return ["CNY", "BTC", "ETH", "FIL", "XCH", "USDT"][type - 1];
  },
  // 充值订单状态
  filterWithdrawStatus(status) {
    return ["审核中", "已完成", "", "", "已取消"][status];
  },
  // 充值订单状态
  filterRechargeStatus(status) {
    return ["待付款", "审核中", "已成功", "已失败", "已关闭"][status];
  },
  // 矿机订单支付状态 0->待付款；1->生效；3->已完成；4->已关闭
  filterOrderPayStatus(status) {
    return ["订单待付款", "订单生效中", "", "订单已完成", "订单已关闭"][status];
  },
  // 矿机订单状态 0->待付款；1->上架中；2->挖矿中；3->已完成；4->已关闭
  filterOrderStatus(status) {
    return ["待付款", "上架中", "挖矿中", "已完成", "已关闭"][status];
  },
  // 截取名字
  filterCardName(v) {
    return v.substr(0, 1) + "**";
  },
  // 截取卡号
  filterCardNo(v) {
    return "****" + v.slice(-4);
  },
  // 代理级别
  filterUserRole(status) {
    return ["新手", "初级代理", "中级代理", "高级代理", "合伙人"][status];
  },
  // 图片地址
  filterBitImg(type) {
    return [
      require("@/assets/images/user/my-cny@2x.png"),
      require("@/assets/images/user/my-btc@2x.png"),
      require("@/assets/images/user/my-eth@2x.png"),
      require("@/assets/images/user/my-fil@2x.png"),
      require("@/assets/images/user/XCH@2x.png"),
      require("@/assets/images/user/my-usdt@2x.png"),
    ][type - 1];
  },
};
