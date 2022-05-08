/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-27 14:55:04
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-09-14 19:53:28
 * @FilePath    : \src\api\system\config.js
 * @Description : 系统管理 - 默认参数配置 - 接口管理
 */
import request from '@/utils/request'

/**
 * @description: 分页获取
 * @param {query} 查询条件
 * @return {type} 
 */
export const getConfigList = (query) => {
  return request({
    url: '/system/configDefault/pageList',
    method: 'post',
    data: query
  })
}

/**
 * @description: 添加-系统默认参数
 * @param {data}  
 * @return {type} 
 */
export const addConfig = (data) => {
  return request({
    url: '/system/configDefault/insert',
    method: 'post',
    data: data
  })
}

/**
 * @description: 删除-系统默认参数
 * @param {Array[long]} ids
 * @return {type} 
 */
export const delConfig = (ids) => {
  return request({
    url: '/system/configDefault/delete',
    method: 'post',
    params: ids
  })
}

/**
 * @description: 获取-系统默认参数信息
 * @param {Long} id
 * @return {type} 
 */
export const getConfig = (id) => {
  return request({
    url: '/system/configDefault/get/' + id,
    method: 'get'
  })
}

/**
 * @description: 修改-系统默认参数
 * @param {long} id
 * @param {data} 
 * @return {type} 
 */
export const updateConfig = (id, data) => {
  return request({
    url: '/system/configDefault/update/' + id,
    method: 'post',
    data: data
  })
}

