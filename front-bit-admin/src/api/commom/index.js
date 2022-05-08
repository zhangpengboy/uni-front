/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-26 11:05:50
 * @Description  : 全局通用接口
 */

import request from '@/utils/request'
import { CLS_SMS, CLS_SMS_SEND, CLS_SMS_SIGNNO, CLS_STORE_CATEGORY, LIST, AREA,UPLOAD, UPLOAD_IMG } from '@/api';

/**
 * @description: 签约
 * @param {*} {mobile: "158xxxx1973", action: "xxx"}
 * @return {*} 
 */
export function getSignNo(params) {
  return request({
    url: CLS_SMS + CLS_SMS_SIGNNO,
    method: 'GET',
    params: params
  })
}

/**
 * @description: 获取手机验证码
 * @param {*}
 * @return {*}
 */
export function getCodeMsg(params) {
  return request({
    url: CLS_SMS + CLS_SMS_SEND,
    method: 'GET',
    params: params
  })
}

/**
 * @description: 获取店铺经营类别
 * @param {*}
 * @return {*}
 */
export function getStoreCategeAllList() {
  return request({
    url: CLS_STORE_CATEGORY + LIST,
    method: 'POST',
  })
}

/**
 * @description: 获取区域列表
 * @param {*} { areaId: xx }  为空获取一级
 * @return {*}
 */
export function getAreaList(params) {
  return request({
    url: AREA + LIST,
    method: 'POST',
    params: params
  })
}

/**
 * @description: 图片上传
 * @param {*}
 * @return {*}
 */
export function uploadImg(data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    baseURL: process.env.VUE_APP_UPLOAD_API,
    url: UPLOAD + UPLOAD_IMG,
    headers: { 'Content-Type': 'multipart/form-data; charset=UTF-8' },
    timeout: 60000,
    method: 'POST',
    data: formData
  })
}