import axios from '@/libs/api.request'
// 查询反馈列表
export const suggestList = (params) => {
    return axios.request({
        url: 'suggest',
        params,
        method: 'get'
    })
}

// 删除反馈
export const removeSuggest = (data) => {
    return axios.request({
        url: 'suggest',
        data,
        method: 'delete'
    })
}

