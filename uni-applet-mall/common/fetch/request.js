/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */

/*
// 开放的接口
	import fetch from './request'
	
	fetch.config.baseUrl = "http://localhost:8080/api/"

	fetch.request(url:'user/list',method:'GET').then((res)=>{
		console.log(JSON.stringify(res))
	})
	fetch.get('user/list').then((res)=>{
		console.log(JSON.stringify(res))
	})
	fetch.get('user/list', {status: 1}).then((res)=>{
		console.log(JSON.stringify(res))
	})
	fetch.post('user', {id:1, status: 1}).then((res)=>{
		console.log(JSON.stringify(res))
	})
	fetch.put('user/1', {status: 2}).then((res)=>{
		console.log(JSON.stringify(res))
	})
	fetch.delete('user/1').then((res)=>{
		console.log(JSON.stringify(res))
	}) 

*/
import QueueUtils from '@/common/utils/QueueUtils.js';
export default {
	config: {
		// baseUrl: "https://app-api.cn.utools.club", // 内网穿透测试地址
		baseUrl: "https://lz.test-api.seprain.com", // 新测试地址
		// baseUrl: "https://lz.api.seprain.com", // 新正式地址
		header: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'
		},
		data: {},
		method: "POST",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.header = options.header || this.config.header
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method

		const userToken = QueueUtils.getJson("userToken");
		const storeToken = QueueUtils.getJson("storeToken");
		// 数据签名
		let _token = {
			// 'Authorization': userToken.tokenHead + userToken.token || 'undefined'
			'user-token': userToken ? (userToken.tokenHead + userToken.token) : undefined,
			// 'store-token': storeToken ? (storeToken.tokenHead + storeToken.token) : undefined
		};
		if (storeToken) {
			_token['store-token'] = storeToken ? (storeToken.tokenHead + storeToken.token) : undefined
		}
		options.header = Object.assign({}, options.header, _token);

		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				// _reslog(response)
				if (statusCode == 200) { //成功
					resolve(response.data);
					if (response.data.code == 401) { // 登陆失效
						uni.showToast({
							title: response.data.message,
							icon: "none"
						})
						QueueUtils.loginClear();
						uni.navigateTo({
							url: "/pages/login/login"
						})
					}
				} else { // 失败
					uni.hideLoading();
					reject(response.data)
					if (response.data.code == 504) {
						uni.showToast({
							title: "网络请求超时,请刷新~",
							icon: "none"
						})
					}
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			// _reqlog(_config)
			// if (process.env.NODE_ENV === 'development') {
			// 	console.log("【" + _config.requestId + "】 地址：" + _config.url)
			// 	if (_config.data) {
			// 		console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
			// 	}
			// }
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	post4j(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.header = {
			'Content-Type': 'application/json',
		}
		options.method = 'POST'
		return this.request(options)
	},
	postxj(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.header = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		}
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + res.config.requestId + "】 地址：" + res.config.url)
		if (res.config.data) {
			console.log("【" + res.config.requestId + "】 请求参数：" + JSON.stringify(res.config.data))
		}
		console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 400:
		case 500:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}
