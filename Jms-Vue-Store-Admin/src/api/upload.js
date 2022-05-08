/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-14 14:51:37
 * @Description : 文件上传服务
 */

import request from '@/utils/request'

/**
 * @description: 图片上传
 * @param {*}
 * @return {*}
 */
export function uploadImg(data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: "/api-upload/upload/img",
    headers: { 'Content-Type': 'multipart/form-data; charset=UTF-8' },
    timeout: 60000,
    method: 'POST',
    data: formData
  })
}
// 小程序商品二维码(base64)
export function downloadQRImg(data) {
  return request({
    url: "/api-goods/cloudStore/goodsQrcode",
    // responseType: 'arraybuffer',
    timeout: 60000,
    method: 'POST',
    data
  })
}
// 数字货架导出
export function downloadExl(params, type) {
  return request({
    url: "/api-goods/cloudStore/" + type,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    responseType: "blob",
    method: 'get',
    params
  })
}
// 订单导出
export function downloadOrderExl(data) {
  return request({
    url: "/api-order/orderV2/export",
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    responseType: "blob",
    method: 'post',
    data
  })
}
// 商品导出
export function downloadGoodsExl(data) {
  return request({
    url: "/api-goods/goods/export",
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    responseType: "blob",
    method: 'post',
    data
  })
}