import axios from '@/libs/api.request'

// 签到规则&联系我们详情
export const getDetail = (id) => {
    return axios.request({
        url: 'others/' + id,
        method: 'get'
    })
}

// 更新签到规则&联系我们
export const update = (data, id) => {
    return axios.request({
        url: 'others/' + id,
        data,
        method: 'put'
    })
}

