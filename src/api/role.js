import axios from '@/libs/api.request'

// 获取角色列表
export const getRoleListData = () => {
  return axios.request({
    url: '/roles',
    method: 'get'
  })
}

// 获取角色详情
export const getRoleDetail = (id) => {
    return axios.request({
        url: '/roles/' + id,
        method: 'get'
    })
}

// 删除多个角色
export const deleteRole = (data) => {
    return axios.request({
        url: '/roles',
        data,
        method: 'delete'
    })
}

// 添加角色
export const addRole = (data) => {
  return axios.request({
    url: '/roles',
    data,
    method: 'post'
  })
}

// 更新角色
export const updateRole = (data) => {
  return axios.request({
    url: '/roles',
    data,
    method: 'put'
  })
}