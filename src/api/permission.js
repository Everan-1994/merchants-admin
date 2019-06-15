import axios from '@/libs/api.request'

// 获取权限列表
export const getPermissionData = () => {
  return axios.request({
    url: '/actions',
    method: 'get'
  })
}

// 获取路由地图
export const getPermissionMapData = () => {
  return axios.request({
    url: '/actions/route',
    method: 'get'
  })
}

// 删除权限
export const deletePermissions = (data) => {
  return axios.request({
    url: '/actions',
    data,
    method: 'delete'
  })
}

// 添加权限
export const addPermission = (data) => {
  return axios.request({
    url: '/actions',
    data,
    method: 'post'
  })
}

// 编辑权限
export const editPermission = (data) => {
    return axios.request({
        url: '/actions',
        data,
        method: 'put'
    })
}

// 排序权限
export const sortPermission = (data) => {
    return axios.request({
        url: '/actions/sort',
        data,
        method: 'patch'
    })
}