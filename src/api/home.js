import axios from '@/libs/api.request'

export const getDatas = (params) => {
    return axios.request({
        url: '/home',
        params,
        method: 'get'
    })
}
