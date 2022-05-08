/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-27 09:34:11
 * @FilePath    : \src\api\system\version.js
 * @Description : 软件版本管理
 */
import request from '@/utils/request'

// 分页查询软件版本
export function listVersion(query) {
  return request({
    url: '/system/softVersion/pageList',
    method: 'get',
    params: query
  })
}

// 查询软件版本详细
export function getVersion(id) {
  return request({
    url: '/system/softVersion/get/' + id,
    method: 'get'
  })
}

// 新增软件版本
export function addVersion(data) {
  return request({
    url: '/system/softVersion/insert',
    method: 'post',
    data: data
  })
}

// 修改软件版本
export function updateVersion(id, data) {
  return request({
    url: '/system/softVersion/update/' + id,
    method: 'post',
    data: data
  })
}

// 软件版本数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 软件版本状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除软件版本
export function delVersion(ids) {
  return request({
    url: '/system/softVersion/delete ',
    method: 'post',
    data: ids
  })
}

// 导出软件版本
export function exportRole(query) {
  return request({
    url: '/system/role/export',
    method: 'get',
    params: query
  })
}