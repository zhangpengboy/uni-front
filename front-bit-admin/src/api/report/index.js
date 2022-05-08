/*
 * @Author      : Lance Yi<latticeyi@gmail.com>
 * @Date        : 2021-03-26 19:16:16
 * @Description : 报表相关
 */
import request from '@/utils/request'

/**
 * @description: 获取资产信息
 * @return {*}
 */
export function getAllMoneyList() {
  return request({
    url: '/api-admin/assert/get',
  })
}

/**
 * @description: 获取资产流水
 * @return {*}
 */
export function getMoneyList(params) {
  return request({
    url: '/api-admin/assert/list',
    params
  })
}
