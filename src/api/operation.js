import axios from '@/libs/api.request'

export const getOperation = (params) => {
    return axios.request({
        url: 'operation',
        params,
        method: 'get'
    })
}
