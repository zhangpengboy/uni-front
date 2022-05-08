/**
 * @description 购物车服务业务请求管理
 * @author LanceYI
 * @time 2019年12月4日11:28:25
 * @email 342003386@qq.com
 */
import fetch from './request'


// 添加商品到购物车
export const addShoppingCart = (data) => {
	return fetch.post('/shopping-cart/shoppingCart/add', data);
}
// 删除购物车商品
export const delShoppingCart = (data) => {
	return fetch.post('/shopping-cart/shoppingCart/delete', data);
}
// 获取购物车列表
export const getShoppingCartList = (data) => {
	return fetch.post('/shopping-cart/shoppingCart/pageList', data);
}
// 根据店铺汇总购物车中的商品
export const getStoreShoppingCartList = (data) => {
	return fetch.post('/shopping-cart/shoppingCart/getCartGoods', data);
}
// 加减购物车商品数量
export const addAndSubCartNum = (data) => {
	return fetch.post('/shopping-cart/shoppingCart/addAndSubNum', data);
}
// 购物车批量收藏商品
export const addGoodsFavorBatch = (data) => {
	return fetch.post('/api-user/userFavor/addGoodsFavorBatch', data);
}




export default {
	addShoppingCart,
	delShoppingCart,
	getShoppingCartList,
	getStoreShoppingCartList,
	addAndSubCartNum,
	addGoodsFavorBatch
}
