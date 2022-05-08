/**
 * @description 全局队列
 * @date 2020年11月18日14:46:01
 * @author Lance yi <latticeyi@gmail.com>
 */
var prefix = 'lzsy_'; // 缓存前缀 

module.exports = {
	getIntegralName() {
		return "礼券"
	},
	//分享人的邀请码
	getInvitation() {
		return uni.getStorageSync("inviteCode")
	},
	//获取APP下载地址
	getAppDownUrl() {
		return uni.getStorageSync("appUrl")
	},
	//分享海报背景图
	fxBgImg() {
		return 'https://lz.static.seprain.com/images/inviteCode/bg%402x.png'
	},
	//365充值分享海报图
	vipFxImg() {
		return 'https://lz.static.seprain.com/images/2021/10/25/fd763ce74897e08db9ab7cb1411862d1.png'
	},
	//全局域名
	publicYuMing() {
		return 'https://lz.wap.seprain.com'
	},
	// 全局CDN域名
	publicCdnHost() {
		return 'https://lz.static.seprain.com'
	},
	//商户注册域名
	publicStoreYuMing() {
		// 测试
		// return 'https://lz.test-wap.seprain.com/store'
		// 正式
		return 'http://lz.wap.seprain.com/store'
	},
	//代理商域名
	publicTheAgentYuMing() {
		// 测试
		// return 'https://lz.test-wap.seprain.com/agent'
		// 正式
		return 'https://lz.wap.seprain.com/agent'
	},
	// 退出登录
	logout() {
		this.remove("openId");
		this.remove("phone");
		this.remove("sessionKey");
		this.remove("buy_goods");
		this.remove("buy_storeGoods");
		this.remove("myInviteCode");
		this.remove("hasLogin");
		this.remove("userToken");
		this.remove("userInfo");
		this.remove("userId");
		this.remove("storeAgent");
		this.remove("pay_order");
		this.remove("searchHistory");
		this.remove("storeToken");
		this.remove("store");
		this.remove("userStoreId");
		this.remove("account");
		this.remove("storeAlipayUser");
		this.remove("refresh");
		this.remove("bsType");
		this.remove("saleStoreId");
		this.remove("saleStoreName");
	},
	// 清除登录状态
	loginClear() {
		this.remove("hasLogin");
		this.remove("userToken");
		this.remove("userInfo");
		this.remove("userId");
		this.remove("storeAgent");
	},
	// 显示loading
	showLoading(title) {
		uni.showLoading({
			title: title || "加载中...",
			mask: true
		});
	},
	// 显示toast
	showToast(title) {
		uni.showToast({
			title: title,
			mask: false,
			duration: 2000,
			icon: "none"
		});
	},
	// 获取搜索key
	getSearchKeys(key) {
		let list =
			"套套，情趣用品，避孕，男用，女用，成人用品，保健品，冈本 杜蕾斯 杰士邦 第六感 倍力乐 诺丝 多乐士 斯香妮 双一 雨蝶 玛尼仕，充气娃娃，娃娃充气 阴蒂 刺激 超薄 螺纹 震动 润滑 女液体 延时 ";
		return list.includes(key);
	},
	// 短息通用签约号
	signNoByType(v) {
		let list = [{
			name: '通用',
			type: 0
		}, {
			name: '提现',
			type: 1
		}, {
			name: '注册',
			type: 2
		}, {
			name: '登录',
			type: 3
		}, {
			name: '绑卡',
			type: 4
		}, {
			name: '购买产品',
			type: 5
		}, {
			name: '修改密码',
			type: 6
		}, {
			name: '申请提现',
			type: 7
		}, {
			name: '修改资料',
			type: 8
		}, {
			name: '异地登录',
			type: 9
		}, {
			name: '省份验证',
			type: 10
		}]
		let strArr = list.find(m => {
			if (m.name == v) return m.type
		});
		return strArr.type;
	},
	// 设置String: JSON数据缓存
	setJson(key, value) {
		let jsonString = JSON.stringify(value);
		try {
			uni.setStorageSync(prefix + key, jsonString);
		} catch (e) {
			// error
		}
	},
	// 设置String: String数据缓存
	setData(key, value) {
		try {
			uni.setStorageSync(prefix + key, value);
		} catch (e) {
			// error
		}
	},
	// 获取String数据
	getData(key) {
		try {
			const value = uni.getStorageSync(prefix + key);
			if (value) {
				return value;
			}
		} catch (e) {
			// error
		}
	},
	// 获取JSON对象
	getJson(key) {
		try {
			const value = uni.getStorageSync(prefix + key);
			if (value) {
				return JSON.parse(value);
			}
		} catch (e) {
			// error
		}
	},

	// 清除本地所有缓存
	clear() {
		uni.clearStorage();
	},
	// 删除某条队列
	remove(key) {
		try {
			uni.removeStorageSync(prefix + key);
		} catch (e) {
			// error
		}
	},
	// 获取队列里面全部的数据
	get(key) {
		let data = this.getJson(key);
		if (data instanceof Array) {
			return data;
		}
		return [];
	},
	// 队列插入数据
	insert(param) {
		param.capacityNum = param.capacityNum || 100; //队列容量 默认队列中超过100条数据，自动删除尾部
		let data = this.getJson(param.key);
		if (data instanceof Array) {
			if (data.length > param.capacityNum) {
				let total = data.length - param.capacityNum;
				for (let i = 0; i < total; i++) {
					data.pop();
				}
			}
			data.unshift(param.value);
		} else {
			data = [];
			data.push(param.value);
		}
		this.setJson(param.key, data);
	},
	// 提供itemIds数组 批量删除队列中的某项数据
	removeItem(key, itemIds) {
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let i = 0; i < itemIds.length; i++) {
				for (let p = 0; p < data.length; p++) {
					if (itemIds[i] === data[p].itemid) {
						data.splice(p, 1);
						break;
					}
				}
			}
			this.setJson(key, data);
		}
	},
	//小数计算加法   
	accAdd(arg1, arg2) {
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		// 这里Math.max(r1, r2)取最长的小数位
		// Math.ceil(length / 3) * 3) 按照位数计算乘以的倍数.比如 2 => 1000, 4 => 1000000
		m = Math.pow(10, Math.ceil(Math.max(r1, r2) / 3) * 3)
		return (arg1 * m - arg2 * m) / m
	},
	isExist(key, itemId) {
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].itemid) {
					return true;
				}
			}
		}
		return false;
	},
	// 获取队列中全部数据数量
	getCount(key) {
		let data = this.getJson(key);
		if (data instanceof Array) {
			return data.length;
		}
		return 0;
	},
	// 参数串化
	stringify(obj, prefix) {
		var pairs = []
		for (var key in obj) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				continue
			}

			var value = obj[key]
			var enkey = encodeURIComponent(key)
			var pair
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
	parse(query) {
		// var parser = /([^=?#&]+)=?([^&]*)/g,
		// while (part = parser.exec(query)) {
		// }
		var result = {},
			part;
		for (part in query) {
			var key = decodeURIComponent(part.replace(/\+/g, ' ')) || null,
				value = decodeURIComponent(query[part].replace(/\+/g, ' ')) || null;
			if (key === null || value === null || key in result) continue;
			result[key] = value;
		}
		return result;
	},
	
	fomatFloat(value, n) {
		var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
		var s = f.toString();
		var rs = s.indexOf('.');   
		if (rs < 0) {     
				s += '.';   
		} 
		for(var i = s.length - s.indexOf('.'); i <= n; i++){
			s += "0";
		}
		return s;
	},
	
	/**
	 * 计算坐标系距离
	 * @param {*} lat1 坐标一 经度
	 * @param {*} lng1 坐标一 维度
	 * @param {*} lat2 坐标二 经度
	 * @param {*} lng2 坐标二 维度
	 * @return 返回坐标系距离 m
	 */
	getDistance(lat1, lng1, lat2, lng2){
	  let radLat1 = (lat1 * Math.PI) / 180.0
	  let radLat2 = (lat2 * Math.PI) / 180.0
	  let a = radLat1 - radLat2
	  let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
	  let s =
	    2 *
	    Math.asin(
	      Math.sqrt(
	        Math.pow(Math.sin(a / 2), 2) +
	        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
	      )
	    )
	  s = s * 6378.137 // EARTH_RADIUS;
	  s = Math.round(s * 10000) / 10
	  return s
	}
};
