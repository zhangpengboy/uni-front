/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-02-16 19:41:45
 * @Description : TODO
 */
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}

const baseUrl = process.env.VUE_APP_BASE_API
export function downLoadZip(str, filename) {
  console.log(321,str);
  let msg = Message.warning({
    message: "正在下载,请稍等",
    type: "warning",
    duration: 0,
  });
  var url = baseUrl + str
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: { 
      'store-token': 'Bearer ' + getToken(),
    }
  }).then(res => {
    msg.close();
    resolveBlob(res, mimeMap.zip)
  })
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')
  var blob = new Blob([res.data], { type: mimeType })
  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.appendChild(aLink)
}
