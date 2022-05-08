/**
 * @author lance yi
 * @date 2019年8月27日
 * @description 全局公共工具方法
 *
 */
var Utils = {
  /**
  * * 获取地址栏参数
  * @param {*} name
  * @returns
  */
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  // 获取appToken
  getAppToken: function (callback) {
    $.ajax({
      type: "POST",
      url: beikeStreetRequest + '/openapi/app/login',
      dataType: 'json',
      ContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: {
        'app_id': app_id,
        'private_key': private_key
      },
      success: function (response) {
        if (response.rsp_code == 'succ') {
          window.localStorage.setItem("appToken", JSON.stringify(response.data))
          callback()
        }
      }
    })
  },
  /**
   * * app webview 礼券签名 * userToken  appToken 需自带上
   * @param {*} obj object params
   * @param {*} code userToken.securityCode or appToken.securityCode
   */
  signSort: function (obj, code) {
    var keys = Object.keys(obj);
    keys = keys.sort();
    var newPareams = {};
    keys.forEach(function (key, i) {
      newPareams[key.toLowerCase()] = obj[key];
    })
    var string = '';
    for (var key in newPareams) {
      string += '&' + key + '=' + newPareams[key];
    }
    string = string.substr(1) + code;
    return hex_md5(string);
  },
  /**
   * * app暴露的方法
   * @param {*} method
   */
  gotosumit: function (method) {
    if (window.jsObj) {  // Android
      // 传递分享数据
      if (window.jsObj[method]) {
        window.jsObj[method]();
      }
    } else {    // IOS
      setupWebViewJavascriptBridge(function (bridge) {
        // 传递分享数据
        bridge.callHandler(method);
      });
    }
  },
  /**
 * * app暴露的方法
 * @param {*} method 方法名
 * @param {*} obj 对象
 */
  gotoAppGoods: function (method, obj) {
    if (_.isNull(Utils.GetQueryString('type'))) {
      if (window.jsObj) {  // Android
        // 传递分享数据
        if (window.jsObj[method]) {
          // 跳栏目
          if (_.isEqual(method, 'gotoGoodsClass')) {
            window.jsObj[method](obj.goodsType);
          } else {
            window.jsObj[method](JSON.stringify(obj));
          }
        }
      } else { // IOS
        setupWebViewJavascriptBridge(function (bridge) {
          // 传递分享数据
          bridge.callHandler(method, obj);
        });
      }
    } else {
      Utils.jumptoWechatPage(obj)
    }
  },
  jumptoWechatPage: function (obj) {
    if (_.isEmpty(obj.goodId)) {
      // 跳栏目
      switch (obj.goodsType) {
        case 'exchange':
          window.location.href = '/js-dist/#/shellExchangeIndex';
          break;
        case 'beikeMstreet':
          window.location.href = '/js-dist/#/';
          break;
        case 'hometownAceGoods':
          window.location.href = '/js-dist/#/homeIndex';
          break;
        case 'merchants':
          window.location.href = '/js-dist/#/bestIndex';
          break;
        case 'beikeMonUpgrade':
          window.location.href = '/app-dist/#/shopkeeperEquity'
          break;
      }

    } else {
      // 跳详情
      switch (obj.goodsType) {
        case 'exchange':
          window.location.href = '/js-dist/#/shellExchangeGoodsInfo?goodsId=' + obj.goodId;
          break;
        case 'beikeMstreet':
          window.location.href = '/js-dist/#/streetGoodsInfo?goodsId=' + obj.goodId;
          break;
        case 'hometownAceGoods':
        case 'merchants':
          window.location.href = '/js-dist/#/goodsInfo?goodsId=' + obj.goodId;
          break;
      }
    }
  },
  /**
   * 返回上一页面
   */
  backPrvePage() {
    window.history.back(-1);
  },

  // 静默登录 匹配code
  getUrlParam: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var urlArr = window.location.href.split('?')
    var search = null
    if (_.size(urlArr) > 2) {
      // 微信回调之后的页面
      search = urlArr[1].split('#')[0] + (urlArr[2] ? '&' + urlArr[2] : '')
    } else {
      search = urlArr[1]
    }
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null) return unescape(r[2])
      return null
    } else {
      return null
    }
  },

  /**
   * 跳转登陆
   * @param {*} url 登陆成功之后重定向页面路径
   */
  toLogin: function (url) {
    window.location.href = '/login.html?appRedirect=' + encodeURIComponent(url)
  }
}
window.Utils = Utils;

// iOS初始化
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}