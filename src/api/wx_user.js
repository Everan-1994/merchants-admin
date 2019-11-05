import axios from '@/libs/api.request'
// 查询用户列表
export const userList = (params) => {
    return axios.request({
        url: 'user',
        params,
        method: 'get'
    })
}

// 更新用户状态
export const toUpdateStatus = (data, id) => {
    return axios.request({
        url: 'user/' + id,
        data,
        method: 'patch'
    })
}

