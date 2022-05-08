/**
 * @description 支付服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'

// 创建支付订单
export const createPayOrder = (data) => {
	return fetch.post('/api-pay/pay/add', data)
}

export default {
	createPayOrder,
}
