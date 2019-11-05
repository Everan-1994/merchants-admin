import axios from '@/libs/api.request'
// 查询中奖列表
export const winningList = (params) => {
    return axios.request({
        url: 'winning',
        params,
        method: 'get'
    })
}

// 更新状态
export const toUpdateStatus = (data, id) => {
    return axios.request({
        url: 'winning/' + id,
        data,
        method: 'patch'
    })
}

