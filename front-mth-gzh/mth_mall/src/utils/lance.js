/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-12-24 16:13:23
 * @Description  : 全局通用方法
 */

const prefix = 'mth-mall-'

module.exports = {
  // 获取积分文字
  getIntegralName () {
    return '礼券'
  },
  // 获取TokenHead
  getTokenHead () {
    return 'Bearer '
  },
  // 设置String: JSON数据缓存
  setJson (key, value) {
    let jsonString = JSON.stringify(value)
    window.localStorage.setItem(prefix + key, jsonString)
  },
  // 获取JSON数据
  getJson (key) {
    const value = window.localStorage.getItem(prefix + key)
    if (value) return JSON.parse(value)
  },
  // 设置String: String数据缓存
  setData (key, value) {
    window.localStorage.setItem(prefix + key, value)
  },
  // 获取String数据
  getData (key) {
    const value = window.localStorage.getItem(prefix + key)
    if (value) return value
  },
  // 清除指定Key数据
  clearStorage (key) {
    window.localStorage.removeItem(prefix + key)
  },
  // 参数串化
  stringify (obj, prefix) {
    let pairs = []
    for (let key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue
      let value = obj[key]; let enkey = encodeURIComponent(key); let pair
      if (typeof value === 'object') {
        pair = this.stringify(value, prefix ? prefix + '[' + enkey + ']' : enkey)
      } else {
        pair = (prefix ? prefix + '[' + enkey + ']' : enkey) + '=' + encodeURIComponent(value)
      }
      pairs.push(pair)
    }
    return pairs.join('&')
  },
  // 参数对象化
  parse (query) {
    let result = {}
    let part = null
    let parser = /([^=?#&]+)=?([^&]*)/g
    // eslint-disable-next-line no-cond-assign
    while (part = parser.exec(query)) {
      let key = decodeURIComponent(part.replace(/\+/g, ' ')) || null
      let value = decodeURIComponent(query[part].replace(/\+/g, ' ')) || null
      if (key === null || value === null || key in result) continue
      result[key] = value
    }
    return result
  },
  // 时间格式化
  parseTime (time, cFormat) {
    if (arguments.length === 0) return null
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time)
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return timeStr
  },
  // JS获取当前时间的前几天、前几周、前几个月、前几年的时间
  getDate (type = null, number = 0) {
    let nowdate = new Date()
    let y, m, d, retrundate
    switch (type) {
      case 'day': // 取number天前、后的时间
        nowdate.setTime(nowdate.getTime() + (24 * 3600 * 1000) * number)
        y = nowdate.getFullYear()
        m = nowdate.getMonth() + 1
        d = nowdate.getDate()
        retrundate = y + '/' + m + '/' + d
        break
      case 'week': // 取number周前、后的时间
        let weekdate = new Date(nowdate + (7 * 24 * 3600 * 1000) * number)
        y = weekdate.getFullYear()
        m = weekdate.getMonth() + 1
        d = weekdate.getDate()
        retrundate = y + '/' + m + '/' + d
        break
      case 'month': // 取number月前、后的时间
        nowdate.setMonth(nowdate.getMonth() + number)
        y = nowdate.getFullYear()
        m = nowdate.getMonth() + 1
        d = nowdate.getDate()
        retrundate = y + '/' + m + '/' + d
        break
      case 'year': // 取number年前、后的时间
        nowdate.setFullYear(nowdate.getFullYear() + number)
        y = nowdate.getFullYear()
        m = nowdate.getMonth() + 1
        d = nowdate.getDate()
        retrundate = y + '/' + m + '/' + d
        break
      default: // 取当前时间
        y = nowdate.getFullYear()
        m = nowdate.getMonth() + 1
        d = nowdate.getDate()
        retrundate = y + '/' + m + '/' + d
    }
    return retrundate
  }
}
