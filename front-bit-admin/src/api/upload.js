/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-04-22 12:20:49
 * @Description : 文件上传服务
 */

import request from '@/utils/request'

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
