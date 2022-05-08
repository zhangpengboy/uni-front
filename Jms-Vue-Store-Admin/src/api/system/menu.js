/*
 * @Author      : Lance Yi [QQ：342003386]
 * @Date        : 2020-08-25 12:15:05
 * @LastEditors : Lance Yi
 * @LastEditTime: 2020-08-26 19:45:39
 * @FilePath    : \src\api\system\menu.js
 * @Description : TODO
 */
import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/getList',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/get/' + menuId,
    method: 'get'
  })
}

// 查询角色类型
export function getRoleType() {
  return request({
    url: '/system/menu/getRoleType',
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu/insert',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(id, data) {
  return request({
    url: '/system/menu/update/' + id,
    method: 'post',
    data: data
  })
}

// 删除菜单
export function delMenu(params) {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    params: params
  })
}