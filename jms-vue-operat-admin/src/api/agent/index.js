/*
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-10-26 11:05:50
 * @Description  : 代理商接口管理
 */

import request from '@/utils/request'
import { CLS_STORE_AGENT, ADD, LIST, AREA } from '@/api';

/**
 * @description: 添加代理商
 * @param {*}
 * @return {*} 
 */
export function addStoreAgent(data) {
  return request({
    url: CLS_STORE_AGENT + ADD,
    method: 'POST',
    data: data
  })
}