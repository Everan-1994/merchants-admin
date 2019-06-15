import axios from '@/libs/api.request'

// 获取成员列表
export const getMemberListData = () => {
    return axios.request({
        url: '/members',
        method: 'get'
    })
}

// 获取成员详情
export const getMemberDetail = (id) => {
    return axios.request({
        url: '/members/' + id,
        method: 'get'
    })
}

// 删除成员
export const deleteMember = (data) => {
    return axios.request({
        url: '/members',
        data,
        method: 'delete'
    })
}

// 添加成员
export const addMember = (data) => {
    return axios.request({
        url: '/members',
        data,
        method: 'post'
    })
}

// 更改成员启用状态
export const changeMemberStatus = (data) => {
    return axios.request({
        url: '/members',
        data,
        method: 'patch'
    })
}

export const updateMember = (data) => {
    return axios.request({
        url: '/members',
        data,
        method: 'put'
    })
}
