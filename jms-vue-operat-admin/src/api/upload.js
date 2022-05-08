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
    timeout: 600000,
    method: 'POST',
    data: formData
  })
}

export function uploadFile(data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: "/api-upload/upload/file",
    headers: { 'Content-Type': 'multipart/form-data; charset=UTF-8'},
    timeout: 120000,
    method: 'POST',
    data: formData
  })
}