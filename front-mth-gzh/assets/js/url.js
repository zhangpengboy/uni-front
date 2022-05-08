/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-05-21 13:58:57
 * @Description : 接口地址管理
 */
// 正式访问域名
var host = "https://wap.meitianhui.com/";
// 正式请求接口路径
var request = 'https://api.meitianhui.com';
// 测试访问域名
// var host = "https://mth-gzh.lanceyi.com/";
// 测试请求接口路径
// var request = 'https://test.lanceyi.com';

/**
 * @author lance
 * @date 2021年5月21日14:50:43
 */
/* ================================ 商务合作 ============================== */

var storeBusinessCooperation = {
  // *  添加商务合作
  add: request + '/api-store/storeBusinessCooperation/add',
  getInfo: request + '/api-goods/goods/detailInfo',
}

/* ================================ 商品服务 ============================== */
var goodsDetailsCooperation = {
  // *  获取商品详细信息
  getInfo: request + '/api-goods/goods/detailInfo',
  // *  获取商品基础信息
  get: request + '/api-goods/goods/detail',
}